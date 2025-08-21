-- Tabla de ajustes clave-valor
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_settings_updated_at on public.settings(updated_at desc);


