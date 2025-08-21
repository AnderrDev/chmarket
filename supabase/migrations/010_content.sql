-- content blocks table for admin-managed JSON content
create table if not exists public.content_blocks (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_blocks_updated_at on public.content_blocks(updated_at desc);


