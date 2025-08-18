-- 003_catalog.sql — Vista unificada (una fila por producto)
begin;

-- Si ya existía una versión previa:
drop view if exists catalog cascade;

create or replace view catalog as
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

  -- Agregamos variantes activas como array JSON
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
  ) filter (where v.id is not null)                                           as variants,

  -- Ayudas para cards/listado
  min(v.price_cents) filter (where v.id is not null)                          as min_price_cents,
  min(v.compare_at_price_cents) filter (where v.compare_at_price_cents is not null) as min_compare_at_price_cents,

  -- Permite resolver un producto dado un variant_id
  array_agg(v.id) filter (where v.id is not null)                             as variant_ids

from products p
left join product_variants v
  on v.product_id = p.id
 and v.is_active = true
where p.is_active = true
group by
  p.id, p.slug, p.name, p.type, p.description, p.long_description,
  p.images, p.is_featured, p.is_active;

commit;


