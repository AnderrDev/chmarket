-- 001_init.sql — Esquema Lean + Cupones + Destacados + Compare-at, con RLS endurecido
begin;

-- =========================================
-- ENUMS (usar DO $$ ... $$ porque CREATE TYPE IF NOT EXISTS no existe)
-- =========================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'discount_type') then
    create type discount_type as enum ('PERCENT','FIXED','FREE_SHIPPING');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('CREATED','PAID','FULFILLED','CANCELLED','REFUNDED');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('PENDING','APPROVED','REJECTED','CANCELLED','REFUNDED');
  end if;
end
$$;

-- =========================================
-- TABLAS: PRODUCTS & VARIANTS
-- =========================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  type text not null check (type in ('creatine','protein')),
  description text,
  long_description text,
  features text[] default '{}',
  ingredients text[] default '{}',
  nutrition_facts jsonb default '{}'::jsonb,
  images jsonb,                           -- <== CORRECTO para seeds y front
  price_cents integer not null,           -- precio base opcional (UI/promos)
  compare_at_price_cents integer,
  currency text not null default 'COP' check (currency = 'COP'),
  rating_avg numeric default 0,
  reviews_count integer default 0,
  is_featured boolean default false,      -- <== DESTACADOS
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  label text not null,
  flavor text,
  size text,
  price_cents integer not null,
  compare_at_price_cents integer,         -- <== PRECIO DE COMPARACIÓN (tachado)
  currency text not null default 'COP' check (currency = 'COP'),
  in_stock integer not null default 0,
  low_stock_threshold integer default 5,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_variants_product on product_variants(product_id);
create index if not exists idx_variants_active on product_variants(is_active);
create index if not exists idx_variants_sku on product_variants(sku);

-- =========================================
-- TABLAS: ORDERS & ORDER ITEMS
-- (pago embebido en orders si luego lo quieres usar)
-- =========================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,        -- usar como external_reference (MP)
  email text not null,
  status order_status not null default 'CREATED',
  subtotal_cents integer not null,
  shipping_cents integer not null default 0,
  discount_cents integer not null default 0,
  total_cents integer not null,
  currency text not null default 'COP' check (currency = 'COP'),

  shipping_address jsonb,
  billing_address jsonb,

  -- Campos de pago embebidos (opcional)
  payment_provider text default 'MERCADO_PAGO',
  payment_status payment_status default 'PENDING',
  payment_preference_id text,
  payment_id text,
  payment_external_reference text,
  payment_raw jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid not null references product_variants(id),
  name_snapshot text not null,
  variant_label text,
  unit_price_cents integer not null,
  quantity integer not null check (quantity > 0)
);

create index if not exists idx_orders_email on orders(email);
create index if not exists idx_orders_created on orders(created_at);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_items_order on order_items(order_id);

-- =========================================
-- TABLAS: DISCOUNT CODES & ORDER DISCOUNTS (snapshot)
-- =========================================
create table if not exists discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,               -- se normaliza a UPPER por trigger
  type discount_type not null,
  value_percent integer,
  value_cents integer,
  currency text not null default 'COP' check (currency = 'COP'),
  min_order_cents integer not null default 0,
  max_redemptions_total integer,
  max_redemptions_per_customer integer,
  combinable boolean not null default false,
  start_at timestamptz,
  end_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_discounts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  discount_id uuid not null references discount_codes(id),
  code_snapshot text not null,
  type_snapshot discount_type not null,
  value_percent_snapshot integer,
  value_cents_snapshot integer,
  amount_applied_cents integer not null default 0,
  currency text not null default 'COP' check (currency = 'COP'),
  created_at timestamptz not null default now()
);

create index if not exists idx_discount_codes_active on discount_codes(is_active);
create index if not exists idx_discount_codes_code on discount_codes(code);
create index if not exists idx_order_discounts_order on order_discounts(order_id);

-- =========================================
-- TRIGGERS: updated_at + uppercase_code
-- =========================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
for each row execute procedure set_updated_at();

drop trigger if exists trg_variants_updated_at on product_variants;
create trigger trg_variants_updated_at before update on product_variants
for each row execute procedure set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
for each row execute procedure set_updated_at();

drop trigger if exists trg_discount_codes_upd on discount_codes;
create trigger trg_discount_codes_upd before update on discount_codes
for each row execute procedure set_updated_at();

create or replace function uppercase_code()
returns trigger language plpgsql as $$
begin
  if new.code is not null then new.code := upper(new.code); end if;
  return new;
end $$;

drop trigger if exists trg_discount_codes_upper on discount_codes;
create trigger trg_discount_codes_upper
before insert or update on discount_codes
for each row execute procedure uppercase_code();

-- =========================================
-- FUNCIÓN: decremento seguro de stock
-- =========================================
create or replace function decrement_inventory_safe(p_variant_id uuid, p_qty int)
returns void language plpgsql as $$
begin
  update product_variants
  set in_stock = in_stock - p_qty
  where id = p_variant_id and in_stock >= p_qty;
  if not found then
    raise exception 'Not enough stock for variant %', p_variant_id;
  end if;
end $$;

-- =========================================
-- VISTA PÚBLICA DE CATÁLOGO (security barrier)
-- =========================================
create or replace view catalog_public
as
select
  p.id                  as product_id,
  p.slug,
  p.name,
  p.type,
  p.description,
  p.long_description,
  p.images,
  p.is_featured,
  v.id                  as variant_id,
  v.label               as variant_label,
  v.price_cents,
  v.compare_at_price_cents,
  v.currency,
  v.in_stock            as stock,
  v.is_active           as variant_active
from products p
join product_variants v on v.product_id = p.id and v.is_active = true
where p.is_active = true;

-- =========================================
-- RLS: activar y políticas mínimas/seguras
-- =========================================
alter table products enable row level security;
alter table product_variants enable row level security;
alter table discount_codes enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_discounts enable row level security;

-- Catálogo & cupones: solo lectura pública (no escritura)
drop policy if exists "public read products" on products;
create policy "public read products" on products
for select using (true);

drop policy if exists "public read variants" on product_variants;
create policy "public read variants" on product_variants
for select using (true);

drop policy if exists "public read discount_codes" on discount_codes;
create policy "public read discount_codes" on discount_codes
for select using (is_active = true and (end_at is null or end_at > now()));

-- Órdenes e items: SOLO service_role (Edge Functions) puede operar
-- (más seguro: el cliente no puede crear/leer órdenes directamente)
drop policy if exists "svc all orders" on orders;
create policy "svc all orders" on orders
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "svc all order_items" on order_items;
create policy "svc all order_items" on order_items
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "svc all order_discounts" on order_discounts;
create policy "svc all order_discounts" on order_discounts
for all using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

commit;
