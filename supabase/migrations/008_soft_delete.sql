begin;

-- 1) Agregar deleted_at a entidades administradas por el panel
alter table products          add column if not exists deleted_at timestamptz;
alter table product_variants  add column if not exists deleted_at timestamptz;
alter table discount_codes    add column if not exists deleted_at timestamptz;

-- 2) Reemplazar UNIQUE por índices parciales (ignoran filas borradas)
-- PRODUCTS.slug
do $$
begin
  -- nombre de la constraint podría variar; la eliminamos si existe
  if exists (select 1 from pg_constraint c
             join pg_class t on t.oid = c.conrelid
             where t.relname = 'products' and c.conname = 'products_slug_key') then
    alter table products drop constraint products_slug_key;
  end if;
end$$;

create unique index if not exists uq_products_slug_active
  on products (slug)
  where deleted_at is null;

-- VARIANTS.sku
do $$
begin
  if exists (select 1 from pg_constraint c
             join pg_class t on t.oid = c.conrelid
             where t.relname = 'product_variants' and c.conname = 'product_variants_sku_key') then
    alter table product_variants drop constraint product_variants_sku_key;
  end if;
end$$;

create unique index if not exists uq_variants_sku_active
  on product_variants (sku)
  where deleted_at is null;

-- 3) Índices para filtros frecuentes
create index if not exists idx_products_active_del    on products(is_active, deleted_at);
create index if not exists idx_variants_active_del    on product_variants(product_id, is_active, deleted_at);
create index if not exists idx_discount_codes_active_del on discount_codes(is_active, deleted_at);

-- 4) RLS: excluir soft-deleted en lecturas públicas
drop policy if exists "public read products" on products;
create policy "public read products" on products
for select using (deleted_at is null);

drop policy if exists "public read variants" on product_variants;
create policy "public read variants" on product_variants
for select using (deleted_at is null);

drop policy if exists "public read discount_codes" on discount_codes;
create policy "public read discount_codes" on discount_codes
for select using (
  deleted_at is null
  and is_active = true
  and (end_at is null or end_at > now())
);

-- Mantener policies de service_role para escrituras (ya las tienes);
-- las dejamos como están o las recreamos explícitas:
drop policy if exists "svc all products" on products;
create policy "svc all products" on products
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "svc all product_variants" on product_variants;
create policy "svc all product_variants" on product_variants
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "svc all discount_codes" on discount_codes;
create policy "svc all discount_codes" on discount_codes
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- 5) Vista catalog: excluir soft-deleted
drop view if exists catalog cascade;

create or replace view catalog as
with variants_active as (
  select v.*
  from product_variants v
  where v.is_active = true and v.deleted_at is null
)
select
  p.id                as product_id,
  p.slug,
  p.name,
  p.type,
  p.description,
  p.long_description,
  p.images,
  p.is_featured,
  p.is_active,

  jsonb_agg(
    jsonb_build_object(
      'variant_id', v.id,
      'variant_label', v.label,
      'sku', v.sku,
      'price_cents', v.price_cents,
      'compare_at_price_cents', v.compare_at_price_cents,
      'currency', v.currency,
      'stock', v.in_stock,
      'is_active', v.is_active
    )
    order by v.price_cents asc, v.label asc
  ) filter (where v.id is not null) as variants,

  coalesce(
    min(v.price_cents) filter (where v.id is not null and v.price_cents is not null and v.price_cents > 0),
    nullif(p.price_cents, 0)
  ) as min_price_cents,
  coalesce(
    min(v.compare_at_price_cents) filter (where v.compare_at_price_cents is not null and v.compare_at_price_cents > 0),
    nullif(p.compare_at_price_cents, 0)
  ) as min_compare_at_price_cents,

  array_agg(v.id) filter (where v.id is not null) as variant_ids

from products p
left join variants_active v on v.product_id = p.id
where p.is_active = true and p.deleted_at is null
group by
  p.id, p.slug, p.name, p.type, p.description, p.long_description,
  p.images, p.is_featured, p.is_active, p.price_cents, p.compare_at_price_cents;

commit;
