// supabase/functions/order-status/index.ts
// Devuelve el estado de una orden por order_number (para pantalla de confirmación).
// Requiere: SUPABASE_URL, SERVICE_ROLE_KEY
// RLS: solo service_role puede consultar órdenes (coincide con tus policies).

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

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
    const url = new URL(req.url);
    const orderNumber = url.searchParams.get("order_number") ?? url.searchParams.get("order");
    const email = url.searchParams.get("email");
    if (!orderNumber) return cors({ error: "order_number required" }, 400);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // 1) Orden
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (oErr) throw oErr;
    if (!order) return cors({ error: "Order not found" }, 404);
    if (email && String(order.email).toLowerCase() !== String(email).toLowerCase()) {
      return cors({ error: "not found" }, 404);
    }

    // 2) Items
    const { data: items, error: iErr } = await supabase
      .from("order_items")
      .select("product_id, variant_id, name_snapshot, variant_label, unit_price_cents, quantity")
      .eq("order_id", order.id);
    if (iErr) throw iErr;

    // 3) Descuento aplicado (snapshot)
    const { data: discounts, error: dErr } = await supabase
      .from("order_discounts")
      .select("code_snapshot, type_snapshot, amount_applied_cents, created_at")
      .eq("order_id", order.id);
    if (dErr) throw dErr;

    // 4) Resumen
    return cors({
      order: {
        order_number: order.order_number,
        email: order.email,
        status: order.status,
        payment_status: order.payment_status,
        subtotal_cents: order.subtotal_cents,
        shipping_cents: order.shipping_cents,
        discount_cents: order.discount_cents,
        total_cents: order.total_cents,
        currency: order.currency,
        created_at: order.created_at,
      },
      items,
      discounts,
    });
  } catch (e) {
    return cors({ error: String(e) }, 400);
  }
});
