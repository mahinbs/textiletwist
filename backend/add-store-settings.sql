-- Store-wide settings table for admin-configurable options (shipping etc.)

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  shipping_enabled boolean not null default true,
  shipping_flat_fee numeric(10,2) not null default 500,
  shipping_free_threshold numeric(10,2) not null default 5000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Simple updated_at trigger
create or replace function public.set_store_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_store_settings_updated_at on public.store_settings;

create trigger trg_store_settings_updated_at
before update on public.store_settings
for each row
execute function public.set_store_settings_updated_at();

