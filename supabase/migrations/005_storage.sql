begin;

-- 1) Crear bucket público (idempotente)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2) Políticas (no existe "IF NOT EXISTS" -> usar DROP + CREATE)

-- Lectura pública de objetos del bucket product-images
drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

-- Escritura solo con service_role (tus Edge Functions)
drop policy if exists "svc write product-images" on storage.objects;
create policy "svc write product-images"
on storage.objects
for all
using (auth.role() = 'service_role' and bucket_id = 'product-images')
with check (auth.role() = 'service_role' and bucket_id = 'product-images');

commit;
