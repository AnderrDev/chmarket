// supabase/functions/mp-webhook/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SERVICE_ROLE_KEY")!;
const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
// Opcional para ambiente dev: token simple para proteger el webhook (?token=...)
// Configúralo con `supabase secrets set MP_WEBHOOK_TOKEN="algo-seguro"`
const MP_WEBHOOK_TOKEN = Deno.env.get("MP_WEBHOOK_TOKEN");

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function resJSON(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

async function fetchPayment(paymentId: string) {
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_TOKEN}` },
  });
  if (!r.ok) throw new Error(`MP /payments/${paymentId} ${r.status}: ${await r.text()}`);
  return r.json();
}

async function onApproved(external_reference: string, mpPayment: any) {
  // 1) Buscar la orden por order_number
  const { data: order, error: oErr } = await sb
    .from("orders")
    .select("id,status,total_cents")
    .eq("order_number", external_reference)
    .single();
  if (oErr || !order) throw new Error(`Order not found for external_reference=${external_reference}`);

  // Idempotencia: si ya está pagada, salir
  if (order.status === "PAID") return;

  // 2) Actualizar payment a PAID
  await sb.from("payments")
    .update({ status: "PAID", raw_payload: mpPayment })
    .eq("external_reference", external_reference)
    .eq("provider", "MERCADO_PAGO");

  // 3) Descontar inventario según items de la orden
  const { data: items, error: iErr } = await sb
    .from("order_items")
    .select("variant_id, quantity")
    .eq("order_id", order.id);
  if (iErr) throw iErr;

  for (const it of items ?? []) {
    // restar stock (no dejar negativo)
    await sb.rpc("decrement_inventory_safe", { p_variant_id: it.variant_id, p_qty: it.quantity });
  }

  // 4) Consumir redención de cupón si existiese (status RESERVED -> CONSUMED)
  await sb
    .from("discount_redemptions")
    .update({ status: "CONSUMED", consumed_at: new Date().toISOString() })
    .eq("order_id", order.id)
    .eq("status", "RESERVED");

  // 5) Marcar orden PAID
  await sb.from("orders").update({ status: "PAID" }).eq("id", order.id);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  // Protege dev con token simple si lo configuraste
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (MP_WEBHOOK_TOKEN && token !== MP_WEBHOOK_TOKEN) {
    return resJSON(401, { error: "unauthorized" });
  }

  try {
    // MP envía notificaciones tipo { action, type, data: { id }, ... } o { type: 'payment' ... }
    const body = await req.json().catch(() => ({} as any));

    // También soporta querystring ?type=payment&id=...
    const type = (body?.type || url.searchParams.get("type") || "").toString();
    const id = (body?.data?.id || url.searchParams.get("id") || "").toString();

    if (type !== "payment" || !id) {
      // Acepta y registra, pero no procesa si no es "payment"
      return resJSON(200, { ok: true, ignored: true });
    }

    // 1) Obtener el pago en MP
    const mpPayment = await fetchPayment(id);

    // Debe traer external_reference que enviamos en la preferencia (order_number)
    const external_reference = mpPayment?.external_reference as string | undefined;
    const status = mpPayment?.status as string | undefined;

    if (!external_reference) {
      // Si no trae, no podemos conciliar – registra y responde 200 para evitar reintentos infinitos
      return resJSON(200, { ok: true, no_external_reference: true });
    }

    // 2) Procesar solo approved (puedes ampliar a refunded/chargeback luego)
    if (status === "approved") {
      await onApproved(external_reference, mpPayment);
    } else if (status === "refunded" || status === "cancelled" || status === "charged_back") {
      // TODO: manejar estados reversibles si lo necesitas
    }

    return resJSON(200, { ok: true });
  } catch (e) {
    console.error(e);
    return resJSON(200, { ok: true, error_logged: true }); // responde 200 para que MP no reintente demasiado
  }
});
