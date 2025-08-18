begin;

-- Permitir escrituras admin via service_role (ya está para orders), aquí para products y variants
alter table products enable row level security;
alter table product_variants enable row level security;

drop policy if exists "svc all products" on products;
create policy "svc all products" on products
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "svc all product_variants" on product_variants;
create policy "svc all product_variants" on product_variants
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

commit;


