// supabase/functions/admin-orders/index.ts
// Endpoints admin para listar y consultar pedidos. Service role only.

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

type ListParams = {
  page?: number
  pageSize?: number
  status?: string
  q?: string
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return cors({ ok: true });
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    const url = new URL(req.url);
    const pathname = url.pathname; // .../admin-orders
    const orderNumberParam = url.searchParams.get('order_number');

    if (req.method === 'GET') {
      // Si viene order_number -> detalle con items
      if (orderNumberParam) {
        const { data: order, error: oErr } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumberParam)
          .maybeSingle();
        if (oErr) throw oErr;
        if (!order) return cors({ error: 'not found' }, 404);

        const { data: items, error: iErr } = await supabase
          .from('order_items')
          .select('product_id, variant_id, name_snapshot, variant_label, unit_price_cents, quantity')
          .eq('order_id', order.id);
        if (iErr) throw iErr;

        const { data: discounts } = await supabase
          .from('order_discounts')
          .select('code_snapshot, type_snapshot, amount_applied_cents, created_at')
          .eq('order_id', order.id);

        return cors({ order, items, discounts: discounts ?? [] });
      }

      // Listado con filtros
      const page = Number(url.searchParams.get('page') ?? '1') || 1;
      const pageSize = Number(url.searchParams.get('pageSize') ?? '25') || 25;
      const status = url.searchParams.get('status') || '';
      const paymentStatus = url.searchParams.get('payment_status') || '';
      const dateFrom = url.searchParams.get('date_from') || '';
      const dateTo = url.searchParams.get('date_to') || '';
      const q = url.searchParams.get('q') || '';

      let query = supabase
        .from('orders')
        .select('id, order_number, email, status, payment_status, total_cents, currency, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (status) query = query.eq('status', status);
      if (paymentStatus) query = query.eq('payment_status', paymentStatus);
      if (dateFrom) query = query.gte('created_at', dateFrom);
      if (dateTo) query = query.lte('created_at', dateTo);
      if (q) {
        // búsqueda simple por email o order_number
        const like = `%${q}%`;
        query = query.or(`email.ilike.${like},order_number.ilike.${like}` as any);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await query.range(from, to);
      if (error) throw error;

      // items_count por orden
      const ids = (data ?? []).map((o: any) => o.id);
      const { data: itemCounts } = await supabase
        .from('order_items')
        .select('order_id, quantity')
        .in('order_id', ids);
      const totals: Record<string, number> = {};
      for (const it of itemCounts ?? []) {
        totals[it.order_id] = (totals[it.order_id] || 0) + Number(it.quantity || 0);
      }
      const rows = (data ?? []).map((o: any) => ({ ...o, items_count: totals[o.id] || 0 }));

      return cors({ items: rows, page, pageSize, total: count ?? 0 });
    }

    if (req.method === 'POST') {
      // Acciones admin: cambiar status (ej. FULFILLED o CANCELLED)
      const body = await req.json().catch(() => ({})) as { order_number?: string; action?: string };
      const orderNumber = body?.order_number;
      const action = String(body?.action || '').toUpperCase();
      if (!orderNumber || !action) return cors({ error: 'order_number and action required' }, 400);

      const { data: order, error: oErr } = await supabase
        .from('orders')
        .select('id, status')
        .eq('order_number', orderNumber)
        .maybeSingle();
      if (oErr) throw oErr;
      if (!order) return cors({ error: 'not found' }, 404);

      if (action === 'FULFILL') {
        await supabase.from('orders').update({ status: 'FULFILLED' }).eq('id', order.id);
        return cors({ ok: true });
      }
      if (action === 'CANCEL') {
        await supabase.from('orders').update({ status: 'CANCELLED' }).eq('id', order.id);
        return cors({ ok: true });
      }
      return cors({ error: 'invalid action' }, 400);
    }

    return cors({ error: 'method not allowed' }, 405);
  } catch (e) {
    return cors({ error: String(e) }, 400);
  }
});


