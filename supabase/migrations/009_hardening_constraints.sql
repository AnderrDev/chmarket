begin;

-- PRODUCTS
alter table products
  add constraint products_price_nonneg check (price_cents >= 0),
  add constraint products_compare_gte_price check (
    compare_at_price_cents is null or compare_at_price_cents >= price_cents
  ),
  add constraint products_rating_range check (rating_avg between 0 and 5),
  add constraint products_reviews_nonneg check (reviews_count >= 0);

-- VARIANTS
alter table product_variants
  add constraint variants_price_nonneg check (price_cents >= 0),
  add constraint variants_compare_gte_price check (
    compare_at_price_cents is null or compare_at_price_cents >= price_cents
  ),
  add constraint variants_stock_nonneg check (in_stock >= 0),
  add constraint variants_low_stock_nonneg check (low_stock_threshold >= 0);

-- Opcionales: formato de slug/sku (suaves, se pueden relajar si molesta)
-- alter table products add constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
-- alter table product_variants add constraint variants_sku_format check (sku ~ '^[A-Z0-9\-\.]+$');

commit;
