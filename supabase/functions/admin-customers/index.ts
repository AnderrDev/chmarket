// supabase/functions/admin-customers/index.ts
// Endpoints admin para listar clientes (agregados desde orders) y ver detalles por email.

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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return cors({ ok: true });

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    if (req.method === 'GET') {
      if (email) {
        // Detalle por email: listar últimas órdenes
        const { data: orders, error } = await supabase
          .from('orders')
          .select('order_number, status, payment_status, total_cents, currency, created_at')
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(50);
        if (error) throw error;
        return cors({ email, orders });
      }

      const page = Number(url.searchParams.get('page') ?? '1') || 1;
      const pageSize = Number(url.searchParams.get('pageSize') ?? '25') || 25;
      const q = url.searchParams.get('q') || '';

      // Obtener emails únicos con agregados desde orders
      // Nota: como Supabase no soporta count exact en agregaciones con groupby fácilmente via JS client,
      // hacemos 2 consultas: una para datos paginados y otra para total con RPC/SQL simple.
      let base = supabase
        .from('orders')
        .select('email, total_cents, created_at, status')
      if (q) base = base.ilike('email', `%${q}%`);
      const { data, error } = await base;
      if (error) throw error;

      const byEmail: Record<string, { email: string; orders_count: number; total_spent_cents: number; last_order_at: string; first_order_at: string }> = {};
      for (const o of (data ?? [])) {
        const key = String(o.email)
        const row = byEmail[key] || (byEmail[key] = { email: key, orders_count: 0, total_spent_cents: 0, last_order_at: o.created_at, first_order_at: o.created_at })
        row.orders_count += 1
        row.total_spent_cents += Number(o.total_cents || 0)
        if (o.created_at > row.last_order_at) row.last_order_at = o.created_at
        if (o.created_at < row.first_order_at) row.first_order_at = o.created_at
      }
      const allRows = Object.values(byEmail).sort((a, b) => b.last_order_at.localeCompare(a.last_order_at))
      const total = allRows.length
      const from = (page - 1) * pageSize
      const to = Math.min(total, from + pageSize)
      const items = allRows.slice(from, to)

      return cors({ items, page, pageSize, total })
    }

    return cors({ error: 'method not allowed' }, 405)
  } catch (e) {
    return cors({ error: String(e) }, 400)
  }
});


