// supabase/functions/order-status/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SERVICE_ROLE_KEY")!;

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function res(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return res(405, { error: "Use POST" });

  try {
    const { order_number, email } = await req.json();
    if (!order_number || !email) return res(400, { error: "Missing order_number or email" });

    // 1) Traer la orden
    const { data: order, error: oErr } = await sb
      .from("orders")
      .select("id, order_number, email, status, currency, subtotal_cents, shipping_cents, discount_cents, total_cents, created_at")
      .eq("order_number", order_number)
      .eq("email", email.toLowerCase())
      .single();

    if (oErr || !order) return res(404, { error: "Order not found" });

    // 2) Traer pago (el más reciente)
    const { data: payment } = await sb
      .from("payments")
      .select("provider, status, preference_id, external_reference, created_at")
      .eq("order_id", order.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3) Traer items
    const { data: items } = await sb
      .from("order_items")
      .select("variant_id, product_id, name_snapshot, variant_label, unit_price_cents, quantity")
      .eq("order_id", order.id);

    return res(200, {
      order,
      payment,
      items: items ?? [],
    });
  } catch (e) {
    console.error(e);
    return res(500, { error: "Unexpected error", detail: String(e) });
  }
});
