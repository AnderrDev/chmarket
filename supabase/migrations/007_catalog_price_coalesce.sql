begin;

-- Re-crear vista `catalog` usando COALESCE con price_cents del producto
drop view if exists catalog cascade;

create or replace view catalog as
with variants_active as (
  select 
    v.*
  from product_variants v
  where v.is_active = true
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
  ) filter (where v.id is not null)                                           as variants,

  coalesce(
    min(v.price_cents) filter (where v.id is not null and v.price_cents is not null and v.price_cents > 0),
    p.price_cents
  ) as min_price_cents,
  coalesce(
    min(v.compare_at_price_cents) filter (where v.compare_at_price_cents is not null and v.compare_at_price_cents > 0),
    p.compare_at_price_cents
  ) as min_compare_at_price_cents,

  array_agg(v.id) filter (where v.id is not null)                             as variant_ids

from products p
left join variants_active v
  on v.product_id = p.id
where p.is_active = true
group by
  p.id, p.slug, p.name, p.type, p.description, p.long_description,
  p.images, p.is_featured, p.is_active, p.price_cents, p.compare_at_price_cents;

commit;


