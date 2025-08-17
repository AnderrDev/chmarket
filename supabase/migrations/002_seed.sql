-- 002_seed.sql — Inserción de productos iniciales
begin;

-- Productos
insert into products (slug, name, type, description, long_description, images, price_cents, compare_at_price_cents, is_featured)
values
  ('creatina-monohidratada', 'Creatina Monohidratada CH+', 'creatine',
    'Creatina pura para mejorar fuerza y rendimiento',
    'La creatina monohidratada CH+ ayuda a mejorar la fuerza, resistencia y recuperación muscular. Ideal para atletas y entusiastas del fitness.',
    '["https://picsum.photos/seed/crea1/800/800","https://picsum.photos/seed/crea1b/800/800"]'::jsonb,
    85000, 95000, true
  ),
  ('creatina-micronizada', 'Creatina Micronizada CH+', 'creatine',
    'Creatina micronizada para mejor absorción',
    'La creatina micronizada CH+ está diseñada para una absorción más rápida y efectiva, optimizando tu rendimiento deportivo.',
    '["https://picsum.photos/seed/crea2/800/800","https://picsum.photos/seed/crea2b/800/800"]'::jsonb,
    95000, 105000, false
  ),
  ('proteina-whey', 'Proteína Whey CH+', 'protein',
    'Proteína whey concentrada para ganar masa muscular',
    'La proteína whey CH+ es ideal para la recuperación y el crecimiento muscular, con alto contenido de aminoácidos esenciales.',
    '["https://picsum.photos/seed/prot1/800/800","https://picsum.photos/seed/prot1b/800/800"]'::jsonb,
    120000, 135000, true
  ),
  ('proteina-isolate', 'Proteína Isolate CH+', 'protein',
    'Proteína aislada de rápida absorción',
    'La proteína isolate CH+ es perfecta para después del entrenamiento, con bajo contenido de carbohidratos y grasas.',
    '["https://picsum.photos/seed/prot2/800/800","https://picsum.photos/seed/prot2b/800/800"]'::jsonb,
    145000, 160000, false
  )
returning id, slug;

-- Variantes
-- Creatina Monohidratada
insert into product_variants (product_id, sku, label, flavor, size, price_cents, compare_at_price_cents, in_stock)
select id, 'CREA-MONO-300', '300g', 'Natural', '300g', 85000, 95000, 50
from products where slug = 'creatina-monohidratada';

insert into product_variants (product_id, sku, label, flavor, size, price_cents, compare_at_price_cents, in_stock)
select id, 'CREA-MONO-500', '500g', 'Natural', '500g', 120000, 130000, 30
from products where slug = 'creatina-monohidratada';

-- Creatina Micronizada
insert into product_variants (product_id, sku, label, flavor, size, price_cents, compare_at_price_cents, in_stock)
select id, 'CREA-MICRO-300', '300g', 'Natural', '300g', 95000, 105000, 40
from products where slug = 'creatina-micronizada';

-- Proteína Whey
insert into product_variants (product_id, sku, label, flavor, size, price_cents, compare_at_price_cents, in_stock)
select id, 'WHEY-VAIN-1KG', '1Kg Vainilla', 'Vainilla', '1Kg', 120000, 135000, 60
from products where slug = 'proteina-whey';

insert into product_variants (product_id, sku, label, flavor, size, price_cents, compare_at_price_cents, in_stock)
select id, 'WHEY-CHOCO-1KG', '1Kg Chocolate', 'Chocolate', '1Kg', 120000, 135000, 45
from products where slug = 'proteina-whey';

-- Proteína Isolate
insert into product_variants (product_id, sku, label, flavor, size, price_cents, compare_at_price_cents, in_stock)
select id, 'ISO-VAIN-900', '900g Vainilla', 'Vainilla', '900g', 145000, 160000, 25
from products where slug = 'proteina-isolate';

commit;
