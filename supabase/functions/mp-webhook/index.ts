// supabase/functions/mp-webhook/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const WEBHOOK_TOKEN = Deno.env.get("MP_WEBHOOK_TOKEN"); // opcional

const mpFetch = (path: string, init?: RequestInit) =>
  fetch(`https://api.mercadopago.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

function plain(text: string, status = 200) {
  return new Response(text, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return plain("ok");

  try {
    if (WEBHOOK_TOKEN) {
      const url = new URL(req.url);
      if (url.searchParams.get("token") !== WEBHOOK_TOKEN) {
        return plain("unauthorized", 401);
      }
    }

    const body = await req.json().catch(() => ({}));
    if (!body?.type || String(body.type).toLowerCase() !== "payment" || !body?.data?.id) {
      return plain("ok");
    }

    const payId = body.data.id;
    const r = await mpFetch(`/v1/payments/${payId}`);
    if (!r.ok) return plain("ok");
    const mp = await r.json();

    const status = String(mp.status || "").toUpperCase();   // APPROVED | PENDING | ...
    const extRef = String(mp.external_reference || "");     // order_number
    const payIdStr = String(mp.id);

    if (!extRef) return plain("ok");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Actualiza pago en la orden
    const { data: order, error: updErr } = await supabase
      .from("orders")
      .update({
        payment_status: status,
        payment_id: payIdStr,
        payment_raw: mp,
      })
      .eq("order_number", extRef)
      .select("id, status")
      .maybeSingle();
    if (updErr || !order) return plain("ok");

    // Si APPROVED → decrementar stock + marcar PAID (idempotente simple)
    if (status === "APPROVED" && order.status !== "PAID") {
      const { data: items } = await supabase
        .from("order_items")
        .select("variant_id, quantity")
        .eq("order_id", order.id);

      for (const it of items ?? []) {
        await supabase.rpc("decrement_inventory_safe", {
          p_variant_id: it.variant_id,
          p_qty: it.quantity,
        });
      }
      await supabase.from("orders").update({ status: "PAID" }).eq("id", order.id);
    }

    return plain("ok");
  } catch {
    return plain("ok");
  }
});
