// supabase/functions/create-preference/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CartItemInput = { variant_id: string; quantity: number };
type CheckoutInput = {
  items: CartItemInput[];
  couponCode?: string;
  customer: { email: string; firstName?: string; lastName?: string; phone?: string };
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;      // inyectado por Supabase
const SERVICE_ROLE = Deno.env.get("SERVICE_ROLE_KEY")!;   // tu secret
const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const FRONTEND_BASE_URL = Deno.env.get("FRONTEND_BASE_URL")!;
const SHIPPING_CENTS_DEFAULT = Number(Deno.env.get("SHIPPING_CENTS_DEFAULT") ?? "1200000");
const FREE_SHIPPING_THRESHOLD_CENTS = Number(Deno.env.get("FREE_SHIPPING_THRESHOLD_CENTS") ?? "5000000");

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function generateOrderNumber() { return `CH${Math.floor(100000 + Math.random() * 900000)}`; }

function badRequest(msg: string, extra: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({ error: msg, ...extra }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
function ok(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return badRequest("Use POST");

  try {
    const body = (await req.json()) as CheckoutInput;
    if (!body?.customer?.email) return badRequest("Missing customer email");
    if (!Array.isArray(body.items) || body.items.length === 0) return badRequest("Empty cart");

    // 1) Traer variantes (sin embed de inventories para evitar nulls)
    const variantIds = body.items.map((i) => i.variant_id);
    const { data: variants, error: vErr } = await sb
      .from("product_variants")
      .select("id, label, price_cents, currency, product_id, is_active, products(name)")
      .in("id", variantIds);
    if (vErr) throw vErr;

    if (!variants || variants.length === 0) {
      return badRequest("Variants not found", { variantIds });
    }

    // 2) Traer inventarios por separado y construir mapa variant_id -> in_stock
    const { data: stocks, error: sErr } = await sb
      .from("inventories")
      .select("variant_id, in_stock")
      .in("variant_id", variantIds);
    if (sErr) throw sErr;

    const stockByVariant = new Map<string, number>(
      (stocks ?? []).map((r: any) => [String(r.variant_id), Number(r.in_stock ?? 0)])
    );

    // 3) Validaciones de cada ítem (activo, moneda, stock)
    const byId = new Map(variants.map((v: any) => [String(v.id), v]));
    for (const it of body.items) {
      const v = byId.get(String(it.variant_id));
      if (!v) return badRequest("Variant not found", { variant_id: it.variant_id });

      if (!v.is_active) return badRequest("Variant inactive", { variant_id: it.variant_id });

      if (v.currency !== "COP") return badRequest("Only COP supported", { variant_id: it.variant_id });

      const stock = Number(stockByVariant.get(String(it.variant_id)) ?? 0);
      if (it.quantity <= 0 || it.quantity > stock) {
        return badRequest("Invalid quantity", { variant_id: it.variant_id, stock });
      }
    }

    // 4) Armar líneas y subtotal
    const lineItems = body.items.map((it) => {
      const v = byId.get(String(it.variant_id))!;
      return {
        variant_id: String(v.id),
        product_id: String(v.product_id),
        name: (v as any).products?.name as string,
        variant_label: String(v.label),
        unit_price_cents: Number(v.price_cents),
        quantity: Number(it.quantity),
      };
    });

    const subtotal_cents = lineItems.reduce((t, l) => t + l.unit_price_cents * l.quantity, 0);

    // 5) Envío + cupón (básico)
    let shipping_cents = subtotal_cents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS_DEFAULT;

    let discount_cents = 0;
    if (body.couponCode) {
      const { data: coupon } = await sb
        .from("discount_codes")
        .select("*")
        .eq("code", body.couponCode.trim().toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (coupon?.type === "PERCENT") {
        discount_cents = Math.floor((subtotal_cents * Number(coupon.value_percent)) / 100);
      } else if (coupon?.type === "FIXED") {
        discount_cents = Math.min(Number(coupon.value_cents ?? 0), subtotal_cents);
      } else if (coupon?.type === "FREE_SHIPPING") {
        discount_cents = shipping_cents; shipping_cents = 0;
      }
    }

    const total_cents = Math.max(0, subtotal_cents + shipping_cents - discount_cents);

    // 6) Crear orden
    const order_number = generateOrderNumber();
    const { data: order, error: oErr } = await sb
      .from("orders")
      .insert({
        order_number,
        email: body.customer.email.toLowerCase(),
        status: "CREATED",
        subtotal_cents,
        shipping_cents,
        discount_cents,
        total_cents,
        currency: "COP",
      })
      .select("id")
      .single();
    if (oErr) throw oErr;

    // 7) Items
    const { error: oiErr } = await sb.from("order_items").insert(
      lineItems.map((li) => ({
        order_id: order.id,
        product_id: li.product_id,
        variant_id: li.variant_id,
        name_snapshot: li.name,
        variant_label: li.variant_label,
        unit_price_cents: li.unit_price_cents,
        quantity: li.quantity,
      }))
    );
    if (oiErr) throw oiErr;

    // 8) Preferencia MP
    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { Authorization: `Bearer ${MP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lineItems.map((li) => ({
          title: `${li.name} - ${li.variant_label}`,
          quantity: li.quantity,
          currency_id: "COP",
          unit_price: li.unit_price_cents / 100,
        })),
        external_reference: order_number,
        back_urls: {
          success: `${FRONTEND_BASE_URL}/success?external_reference=${order_number}`,
          pending: `${FRONTEND_BASE_URL}/pending?external_reference=${order_number}`,
          failure: `${FRONTEND_BASE_URL}/failure?external_reference=${order_number}`,
        },
        auto_return: "approved",
        payer: { email: body.customer.email },
        statement_descriptor: "CH+ Supplements",
      }),
    });
    if (!mpRes.ok) {
      const detail = await mpRes.text();
      return badRequest("Mercado Pago error", { detail });
    }
    const pref = await mpRes.json();

    // 9) Payment PENDING
    await sb.from("payments").insert({
      order_id: order.id,
      provider: "MERCADO_PAGO",
      status: "PENDING",
      amount_cents: total_cents,
      currency: "COP",
      preference_id: pref.id,
      external_reference: order_number,
      raw_payload: pref,
    });

    return ok({
      order_number,
      preference_id: pref.id,
      init_point: pref.init_point ?? pref.sandbox_init_point,
      total_cents,
      currency: "COP",
    });
  } catch (e) {
    console.error(e);
    return badRequest("Unexpected error", { detail: String(e) });
  }
});
