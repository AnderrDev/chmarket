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

function logInfo(scope: string, data: Record<string, unknown>) {
  try { console.log(JSON.stringify({ scope, level: 'info', ...data })) } catch { console.log(`[info] ${scope}`) }
}

function logError(scope: string, data: Record<string, unknown>) {
  try { console.error(JSON.stringify({ scope, level: 'error', ...data })) } catch { console.error(`[error] ${scope}`) }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return cors({ ok: true });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    if (req.method === 'GET') {
      logInfo('admin-products:get:start', {})
      // Listar productos con variantes, incluyendo inactivos
      const { data: products, error: pErr } = await supabase
        .from('products')
        .select('id, slug, name, type, description, long_description, features, ingredients, nutrition_facts, images, price_cents, compare_at_price_cents, currency, is_featured, is_active, created_at')
        .order('created_at', { ascending: false });
      if (pErr) {
        logError('admin-products:get:products_error', { message: pErr.message, details: pErr.details, hint: pErr.hint })
        throw pErr
      }

      const productIds = (products ?? []).map((p: any) => p.id);
      const { data: variants, error: vErr } = await supabase
        .from('product_variants')
        .select('id, product_id, sku, label, flavor, size, price_cents, compare_at_price_cents, currency, in_stock, low_stock_threshold, is_active, created_at')
        .in('product_id', productIds);
      if (vErr) {
        logError('admin-products:get:variants_error', { message: vErr.message, details: vErr.details, hint: vErr.hint })
        throw vErr
      }

      const grouped: Record<string, any[]> = {};
      for (const v of (variants ?? [])) {
        const arr = grouped[v.product_id] || (grouped[v.product_id] = []);
        arr.push(v);
      }

      const rows = (products ?? []).map((p: any) => ({ ...p, variants: grouped[p.id] ?? [] }));
      logInfo('admin-products:get:ok', { count: rows.length })
      return cors({ items: rows });
    }

    if (req.method === 'POST') {
      const body = (await req.json()) as UpsertPayload & { default_stock?: number; default_label?: string };
      logInfo('admin-products:post:start', { product_id: body?.product?.id ?? null, slug: body?.product?.slug ?? null, variants: Array.isArray(body?.variants) ? body.variants.length : null })
      if (!body?.product || !Array.isArray(body.variants)) {
        logError('admin-products:post:invalid_payload', {})
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
      if (slugErr) {
        logError('admin-products:post:slug_query_error', { message: slugErr.message, details: slugErr.details, hint: slugErr.hint })
        throw slugErr;
      }

      if (slugRow && (!body.product.id || slugRow.id !== body.product.id)) {
        logError('admin-products:post:slug_not_unique', { slug })
        return cors({ error: 'slug_not_unique' }, 409);
      }

      for (const v of body.variants) {
        const sku = (v.sku || '').trim();
        if (!sku) {
          logError('admin-products:post:sku_missing', {})
          return cors({ error: 'sku required' }, 400);
        }
        const { data: skuRow, error: skuErr } = await supabase
          .from('product_variants')
          .select('id')
          .eq('sku', sku)
          .maybeSingle();
        if (skuErr) {
          logError('admin-products:post:sku_query_error', { message: skuErr.message, details: skuErr.details, hint: skuErr.hint })
          throw skuErr;
        }
        if (skuRow && (!v.id || skuRow.id !== v.id)) {
          logError('admin-products:post:sku_not_unique', { sku })
          return cors({ error: 'sku_not_unique', sku }, 409);
        }
        // Validación simple de precios
        if (typeof v.price_cents !== 'number' || v.price_cents < 0) {
          logError('admin-products:post:invalid_variant_price', { sku, price_cents: v.price_cents })
          return cors({ error: 'invalid_variant_price' }, 400);
        }
        if (v.compare_at_price_cents != null && v.compare_at_price_cents < v.price_cents) {
          logError('admin-products:post:invalid_variant_compare_at', { sku, compare_at: v.compare_at_price_cents, price: v.price_cents })
          return cors({ error: 'invalid_variant_compare_at' }, 400);
        }
      }

      // Derivar precio de producto si no viene, usando el mínimo de variantes
      const minVariantPrice = body.variants.length > 0
        ? body.variants.reduce((min, v) => Math.min(min, v.price_cents), Number.POSITIVE_INFINITY)
        : null;
      const productPriceCents = (body.product.price_cents ?? undefined) !== undefined
        ? body.product.price_cents!
        : (minVariantPrice !== null && isFinite(minVariantPrice) ? minVariantPrice : null);
      if (productPriceCents == null) {
        logError('admin-products:post:price_required', {})
        return cors({ error: 'price_required' }, 400);
      }
      const productCompareAt = body.product.compare_at_price_cents != null && body.product.compare_at_price_cents >= productPriceCents
        ? body.product.compare_at_price_cents
        : null;

      // Upsert de producto
      const prod = body.product;
      const baseUpdate: Record<string, unknown> = {
        slug: prod.slug,
        name: prod.name,
        type: prod.type,
        description: prod.description ?? null,
        long_description: prod.long_description ?? null,
        nutrition_facts: prod.nutrition_facts ?? {},
        images: Array.isArray(prod.images) ? prod.images : (prod.images ?? null),
        price_cents: productPriceCents,
        compare_at_price_cents: productCompareAt,
        currency: prod.currency ?? 'COP',
        is_featured: prod.is_featured ?? false,
        is_active: prod.is_active ?? true,
      };
      // Incluir arrays sólo si son válidos; evita errores de casteo
      if (Array.isArray(prod.features)) baseUpdate.features = prod.features;
      if (Array.isArray(prod.ingredients)) baseUpdate.ingredients = prod.ingredients;
      let productId = prod.id ?? null;
      if (productId) {
        const { error: upErr } = await supabase
          .from('products')
          .update(baseUpdate)
          .eq('id', productId);
        if (upErr) {
          logError('admin-products:post:update_failed', { message: upErr.message, details: upErr.details, hint: upErr.hint, product_id: productId })
          return cors({ error: upErr.message ?? 'update_failed', details: upErr.details ?? null, hint: upErr.hint ?? null }, 400);
        }
      } else {
        const insertObj: Record<string, unknown> = { ...baseUpdate };
        // Para insert, si no incluimos arrays, Postgres aplicará defaults
        if (!('features' in insertObj)) delete insertObj.features;
        if (!('ingredients' in insertObj)) delete insertObj.ingredients;
        const { data: ins, error: inErr } = await supabase
          .from('products')
          .insert(insertObj)
          .select('id')
          .single();
        if (inErr) {
          logError('admin-products:post:insert_failed', { message: inErr.message, details: inErr.details, hint: inErr.hint, insert: insertObj })
          return cors({ error: inErr.message ?? 'insert_failed', details: inErr.details ?? null, hint: inErr.hint ?? null }, 400);
        }
        productId = ins.id;
      }

      // Si no hay variantes en payload, crear una variante por defecto basada en el precio del producto
      let variantsToProcess: VariantPayload[] = (body.variants && body.variants.length > 0)
        ? body.variants
        : [{
            sku: `${slug.replace(/[^a-zA-Z0-9]+/g,'-').toUpperCase()}-${Date.now()}`,
            label: (body.default_label && String(body.default_label).trim()) || 'Default',
            price_cents: productPriceCents,
            compare_at_price_cents: productCompareAt ?? undefined,
            currency: prod.currency ?? 'COP',
            in_stock: Number.isFinite(body.default_stock as number) ? Number(body.default_stock) : 0,
            is_active: true,
          } as VariantPayload]

      // Si vienen variantes pero sólo una, y hasVariants indicado (implícito si variants.length>0), permitir 1 pero marcarla 'Default' si label vacío
      if (Array.isArray(body.variants) && body.variants.length === 1) {
        const only = body.variants[0]
        if (!only.label || only.label.trim() === '') {
          only.label = 'Default'
        }
        variantsToProcess = [only]
      }

      // Sincronizar: borrar variantes que ya no están en el payload
      const { data: existingVarRows, error: exErr } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
      if (exErr) {
        logError('admin-products:post:fetch_existing_variants_failed', { message: exErr.message, details: exErr.details, hint: exErr.hint })
        return cors({ error: exErr.message ?? 'fetch_existing_variants_failed' }, 400)
      }
      const existingIds = new Set<string>((existingVarRows || []).map((r: any) => r.id))
      const keepIds = new Set<string>(variantsToProcess.filter(v => !!v.id).map(v => String(v.id)))
      let idsToDelete: string[] = []
      if (Array.isArray(body.variants) && body.variants.length > 0) {
        // modo con variantes explícitas: eliminar las que no vienen
        idsToDelete = Array.from(existingIds).filter(id => !keepIds.has(id))
      } else {
        // modo sin variantes: vamos a crear Default → eliminar todas las existentes para evitar duplicados
        idsToDelete = Array.from(existingIds)
      }
      if (idsToDelete.length > 0) {
        const { error: delErr } = await supabase
          .from('product_variants')
          .delete()
          .in('id', idsToDelete)
        if (delErr) {
          logError('admin-products:post:variants_delete_failed', { message: delErr.message, details: delErr.details, hint: delErr.hint, ids: idsToDelete })
          return cors({ error: delErr.message ?? 'variants_delete_failed' }, 400)
        }
      }

      // Upsert de variantes: si trae id, actualiza; si no, inserta
      for (const v of variantsToProcess) {
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
          if (uErr) {
            logError('admin-products:post:variant_update_failed', { message: uErr.message, details: uErr.details, hint: uErr.hint, variant_id: v.id })
            return cors({ error: uErr.message ?? 'variant_update_failed', details: uErr.details ?? null, hint: uErr.hint ?? null }, 400);
          }
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
          if (iErr) {
            logError('admin-products:post:variant_insert_failed', { message: iErr.message, details: iErr.details, hint: iErr.hint, sku: v.sku })
            return cors({ error: iErr.message ?? 'variant_insert_failed', details: iErr.details ?? null, hint: iErr.hint ?? null }, 400);
          }
        }
      }
      logInfo('admin-products:post:ok', { product_id: productId })
      return cors({ ok: true, product_id: productId });
    }

    if (req.method === 'DELETE') {
      if (!id) return cors({ error: 'id required' }, 400);
    
      // Marca producto como eliminado
      const now = new Date().toISOString();
    
      const { error: upProdErr } = await supabase
        .from('products')
        .update({ deleted_at: now, is_active: false })
        .eq('id', id);
      if (upProdErr) return cors({ error: upProdErr.message }, 400);
    
      // Marca variantes del producto como eliminadas
      const { error: upVarErr } = await supabase
        .from('product_variants')
        .update({ deleted_at: now, is_active: false })
        .eq('product_id', id);
      if (upVarErr) return cors({ error: upVarErr.message }, 400);
    
      return cors({ ok: true });
    }
    // Otros métodos no permitidos
    return cors({ error: 'method not allowed' }, 405);
  } catch (e) {
    logError('admin-products:unhandled', { error: String(e) })
    return cors({ error: String(e) }, 400);
  }
});


