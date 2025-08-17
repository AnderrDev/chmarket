// supabase/functions/create-preference/index.ts
// Crea la orden + ítems (+ snapshot de cupón si aplica) y genera preferencia de Mercado Pago.
// Guarda preference_id en orders.payment_preference_id.
// Requiere: SUPABASE_URL, SERVICE_ROLE_KEY, MP_ACCESS_TOKEN

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;

type CartItem = { variant_id: string; quantity: number };

type Payload = {
  email: string;
  items: CartItem[];
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  couponCode?: string;          // ej: "WELCOME10"
  shippingCents?: number;       // opcional (0 por defecto)
  currency?: string;            // "COP" por defecto
};

const mpFetch = (path: string, init?: RequestInit) =>
  fetch(`https://api.mercadopago.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

// Utilidad: CORS
function cors(json: unknown, status = 200) {
  return new Response(JSON.stringify(json), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return cors({ ok: true });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const origin = new URL(req.url).origin;

    const body = (await req.json()) as Payload;
    if (!body?.email || !Array.isArray(body.items) || body.items.length === 0) {
      return cors({ error: "Invalid payload" }, 400);
    }

    const currency = body.currency ?? "COP";
    const shippingCents = Math.max(0, body.shippingCents ?? 0);

    // 1) Traer variantes y producto para snapshot de nombre
    const variantIds = body.items.map((i) => i.variant_id);
    const { data: rows, error: rowsErr } = await supabase
      .from("product_variants")
      .select("id, label, price_cents, in_stock, product_id, products(name)")
      .in("id", variantIds);
    if (rowsErr) throw rowsErr;
    if (!rows || rows.length !== variantIds.length) {
      return cors({ error: "Some variants not found" }, 400);
    }
    const mapVariant = new Map(rows.map((r) => [r.id, r]));

    // 2) Calcular subtotal
    let subtotal = 0;
    for (const it of body.items) {
      const v = mapVariant.get(it.variant_id);
      if (!v) return cors({ error: `Variant not found: ${it.variant_id}` }, 400);
      if (!Number.isFinite(it.quantity) || it.quantity <= 0) {
        return cors({ error: `Invalid quantity for ${it.variant_id}` }, 400);
      }
      // No disminuimos stock aquí; se hace en webhook cuando el pago queda APPROVED
      subtotal += v.price_cents * it.quantity;
    }

    // 3) Cupón (simple a nivel de orden)
    let discountCents = 0;
    let finalShipping = shippingCents;
    let discountRow: any = null;

    if (body.couponCode) {
      const code = String(body.couponCode).toUpperCase();
      const { data: dc, error: dcErr } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .maybeSingle();
      if (dcErr) throw dcErr;

      if (dc) {
        discountRow = dc;
        if (dc.type === "PERCENT") {
          const pct = Math.max(0, Math.min(100, dc.value_percent ?? 0));
          discountCents = Math.floor((subtotal * pct) / 100);
        } else if (dc.type === "FIXED") {
          discountCents = Math.max(0, Math.min(dc.value_cents ?? 0, subtotal));
        } else if (dc.type === "FREE_SHIPPING") {
          finalShipping = 0;
        }
      }
    }

    const total = Math.max(0, subtotal + finalShipping - discountCents);

    // 4) order_number
    const orderNumber = `CH${Date.now()}`;

    // 5) Insertar orden (status CREATED / payment PENDING)
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        email: body.email,
        status: "CREATED",
        subtotal_cents: subtotal,
        shipping_cents: finalShipping,
        discount_cents: discountCents,
        total_cents: total,
        currency,
        shipping_address: body.shippingAddress ?? null,
        billing_address: body.billingAddress ?? null,
        payment_provider: "MERCADO_PAGO",
        payment_status: "PENDING",
        payment_external_reference: orderNumber,
      })
      .select("id")
      .single();
    if (oErr) throw oErr;

    // 6) Insertar items con snapshot
    const itemsToInsert = body.items.map((it) => {
      const v = mapVariant.get(it.variant_id)!;
      const name = v.products?.name ?? ""; // snapshot mínimo, opcional
      return {
        order_id: order.id,
        product_id: v.product_id,
        variant_id: v.id,
        name_snapshot: name,
        variant_label: v.label,
        unit_price_cents: v.price_cents,
        quantity: it.quantity,
      };
    });
    const { error: oiErr } = await supabase.from("order_items").insert(itemsToInsert);
    if (oiErr) throw oiErr;

    // 7) Snapshot de descuento (si aplica)
    if (discountRow) {
      const { error: odErr } = await supabase.from("order_discounts").insert({
        order_id: order.id,
        discount_id: discountRow.id,
        code_snapshot: discountRow.code,
        type_snapshot: discountRow.type,
        value_percent_snapshot: discountRow.value_percent ?? null,
        value_cents_snapshot: discountRow.value_cents ?? null,
        amount_applied_cents: discountCents,
        currency,
      });
      if (odErr) throw odErr;
    }

    // 8) Crear preferencia MP
    const prefRes = await mpFetch("/checkout/preferences", {
      method: "POST",
      body: JSON.stringify({
        items: body.items.map((it) => {
          const v = mapVariant.get(it.variant_id)!;
          return {
            title: v.label,
            quantity: it.quantity,
            unit_price: v.price_cents / 100,
            currency_id: currency,
          };
        }),
        external_reference: orderNumber,
        back_urls: {
          success: `${origin}/success`,
          pending: `${origin}/pending`,
          failure: `${origin}/failure`,
        },
        auto_return: "approved",
      }),
    });
    if (!prefRes.ok) {
      const t = await prefRes.text();
      throw new Error(`MercadoPago error: ${t}`);
    }
    const pref = await prefRes.json();

    // 9) Guardar preference_id en la orden
    const { error: upErr } = await supabase
      .from("orders")
      .update({ payment_preference_id: pref.id })
      .eq("id", order.id);
    if (upErr) throw upErr;

    // 10) Responder
    return cors({
      order_number: orderNumber,
      preference_id: pref.id,
      init_point: pref.init_point ?? null,
      sandbox_init_point: pref.sandbox_init_point ?? null,
    });
  } catch (e) {
    return cors({ error: String(e) }, 400);
  }
});
