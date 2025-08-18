// supabase/functions/admin-products/index.ts
// CRUD básico de productos y variantes para panel admin.
// Requiere: SUPABASE_URL y SERVICE_ROLE_KEY. No aplica auth de usuario por ahora.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

type ProductPayload = {
  id?: string;
  slug: string;
  name: string;
  type: 'creatine' | 'protein';
  description?: string | null;
  long_description?: string | null;
  features?: string[] | null;
  ingredients?: string[] | null;
  nutrition_facts?: Record<string, unknown> | null;
  images?: unknown;
  price_cents?: number | null;
  compare_at_price_cents?: number | null;
  currency?: string | null;
  is_featured?: boolean | null;
  is_active?: boolean | null;
};

type VariantPayload = {
  id?: string;
  sku: string;
  label: string;
  flavor?: string | null;
  size?: string | null;
  price_cents: number;
  compare_at_price_cents?: number | null;
  currency?: string | null;
  in_stock: number;
  low_stock_threshold?: number | null;
  is_active?: boolean | null;
};

type UpsertPayload = {
  product: ProductPayload;
  variants: VariantPayload[];
};

function cors(json: unknown, status = 200) {
  return new Response(JSON.stringify(json), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return cors({ ok: true });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    if (req.method === 'GET') {
      // Listar productos con variantes, incluyendo inactivos
      const { data: products, error: pErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (pErr) throw pErr;

      const productIds = (products ?? []).map((p: any) => p.id);
      const { data: variants, error: vErr } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds);
      if (vErr) throw vErr;

      const grouped: Record<string, any[]> = {};
      for (const v of (variants ?? [])) {
        const arr = grouped[v.product_id] || (grouped[v.product_id] = []);
        arr.push(v);
      }

      const rows = (products ?? []).map((p: any) => ({ ...p, variants: grouped[p.id] ?? [] }));
      return cors({ items: rows });
    }

    if (req.method === 'POST') {
      const body = (await req.json()) as UpsertPayload;
      if (!body?.product || !Array.isArray(body.variants)) {
        return cors({ error: 'Invalid payload' }, 400);
      }

      // Validaciones de unicidad básicas
      const slug = (body.product.slug || '').trim();
      if (!slug) return cors({ error: 'slug required' }, 400);
      const { data: slugRow, error: slugErr } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (slugErr) throw slugErr;

      if (slugRow && (!body.product.id || slugRow.id !== body.product.id)) {
        return cors({ error: 'slug_not_unique' }, 409);
      }

      for (const v of body.variants) {
        const sku = (v.sku || '').trim();
        if (!sku) return cors({ error: 'sku required' }, 400);
        const { data: skuRow, error: skuErr } = await supabase
          .from('product_variants')
          .select('id')
          .eq('sku', sku)
          .maybeSingle();
        if (skuErr) throw skuErr;
        if (skuRow && (!v.id || skuRow.id !== v.id)) {
          return cors({ error: 'sku_not_unique', sku }, 409);
        }
      }

      // Upsert de producto
      const prod = body.product;
      let productId = prod.id ?? null;
      if (productId) {
        const { error: upErr } = await supabase
          .from('products')
          .update({
            slug: prod.slug,
            name: prod.name,
            type: prod.type,
            description: prod.description ?? null,
            long_description: prod.long_description ?? null,
            features: prod.features ?? [],
            ingredients: prod.ingredients ?? [],
            nutrition_facts: prod.nutrition_facts ?? {},
            images: Array.isArray(prod.images) ? prod.images : (prod.images ?? null),
            price_cents: prod.price_cents ?? null,
            compare_at_price_cents: prod.compare_at_price_cents ?? null,
            currency: prod.currency ?? 'COP',
            is_featured: prod.is_featured ?? false,
            is_active: prod.is_active ?? true,
          })
          .eq('id', productId);
        if (upErr) throw upErr;
      } else {
        const { data: ins, error: inErr } = await supabase
          .from('products')
          .insert({
            slug: prod.slug,
            name: prod.name,
            type: prod.type,
            description: prod.description ?? null,
            long_description: prod.long_description ?? null,
            features: prod.features ?? [],
            ingredients: prod.ingredients ?? [],
            nutrition_facts: prod.nutrition_facts ?? {},
            images: Array.isArray(prod.images) ? prod.images : (prod.images ?? null),
            price_cents: prod.price_cents ?? null,
            compare_at_price_cents: prod.compare_at_price_cents ?? null,
            currency: prod.currency ?? 'COP',
            is_featured: prod.is_featured ?? false,
            is_active: prod.is_active ?? true,
          })
          .select('id')
          .single();
        if (inErr) throw inErr;
        productId = ins.id;
      }

      // Upsert de variantes: si trae id, actualiza; si no, inserta
      for (const v of body.variants) {
        if (v.id) {
          const { error: uErr } = await supabase
            .from('product_variants')
            .update({
              sku: v.sku,
              label: v.label,
              flavor: v.flavor ?? null,
              size: v.size ?? null,
              price_cents: v.price_cents,
              compare_at_price_cents: v.compare_at_price_cents ?? null,
              currency: v.currency ?? 'COP',
              in_stock: v.in_stock,
              low_stock_threshold: v.low_stock_threshold ?? 5,
              is_active: v.is_active ?? true,
            })
            .eq('id', v.id);
          if (uErr) throw uErr;
        } else {
          const { error: iErr } = await supabase
            .from('product_variants')
            .insert({
              product_id: productId,
              sku: v.sku,
              label: v.label,
              flavor: v.flavor ?? null,
              size: v.size ?? null,
              price_cents: v.price_cents,
              compare_at_price_cents: v.compare_at_price_cents ?? null,
              currency: v.currency ?? 'COP',
              in_stock: v.in_stock,
              low_stock_threshold: v.low_stock_threshold ?? 5,
              is_active: v.is_active ?? true,
            });
          if (iErr) throw iErr;
        }
      }

      return cors({ ok: true, product_id: productId });
    }

    if (req.method === 'DELETE') {
      if (!id) return cors({ error: 'id required' }, 400);
      // Borra producto (cascada elimina variantes)
      const { error: dErr } = await supabase.from('products').delete().eq('id', id);
      if (dErr) throw dErr;
      return cors({ ok: true });
    }

    return cors({ error: 'method not allowed' }, 405);
  } catch (e) {
    return cors({ error: String(e) }, 400);
  }
});


