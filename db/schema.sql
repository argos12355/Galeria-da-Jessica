-- Galeria da Jessica — schema Postgres (Supabase)
-- Rodar em: Supabase Studio > SQL Editor, ou `supabase db push`.
--
-- Conteúdo escrito pela artista fica em jsonb {"pt": "...", "en": "..."}.
-- Português é obrigatório; inglês é opcional e cai no português se faltar.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type commission_status as enum (
  'queued', 'sketch', 'lineart', 'coloring',   -- ocupam vaga
  'done', 'delivered', 'cancelled'             -- liberam a vaga
);

create type commissions_mode as enum ('auto', 'forced_open', 'forced_closed');

create type client_platform as enum ('discord', 'twitter', 'other');

-- ---------------------------------------------------------------------------
-- Helpers de tradução
-- ---------------------------------------------------------------------------

-- Espelha src/i18n/localized.ts: pedido → padrão → vazio.
create or replace function i18n_text(field jsonb, locale text, default_locale text default 'pt')
returns text
language sql
immutable
as $$
  select coalesce(
    nullif(field ->> locale, ''),
    nullif(field ->> default_locale, ''),
    ''
  );
$$;

-- Usado nos CHECKs: garante que o português nunca fique em branco.
create or replace function has_default_locale(field jsonb)
returns boolean
language sql
immutable
as $$
  select nullif(field ->> 'pt', '') is not null;
$$;

-- ---------------------------------------------------------------------------
-- 1. site_settings — linha única com toda a personalização do site
-- ---------------------------------------------------------------------------
create table site_settings (
  -- Truque de singleton: só existe id = true, então nunca há 2 configurações.
  id boolean primary key default true check (id),

  site_title        jsonb not null default '{"pt": "Galeria da Jessica"}'
                          check (has_default_locale(site_title)),
  tagline           jsonb not null default '{"pt": ""}',
  about_text        jsonb not null default '{"pt": ""}',
  avatar_url        text,
  banner_url        text,

  -- Tema (lidos como CSS custom properties no <html>)
  color_primary     text  not null default '#e879f9',
  color_background  text  not null default '#0a0a0a',
  color_accent      text  not null default '#22d3ee',
  font_heading      text  not null default 'Geist',
  layout_variant    text  not null default 'grid'
                          check (layout_variant in ('grid', 'masonry', 'carousel')),

  -- Contato (o pop-up de comissão lê daqui)
  discord_url       text,
  discord_handle    text,
  twitter_url       text,
  twitter_handle    text,
  -- Lista de regras: {"pt": ["Pago 50% adiantado", "..."], "en": [...]}
  commission_rules  jsonb not null default '{"pt": []}',

  -- Vagas
  max_slots         integer not null default 5 check (max_slots >= 0),
  commissions_mode  commissions_mode not null default 'auto',

  nsfw_warning_text jsonb not null default
                          '{"pt": "Este conteúdo é destinado a maiores de 18 anos."}',
  updated_at        timestamptz not null default now()
);

insert into site_settings (id) values (true) on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 2. artworks — obras da galeria
-- ---------------------------------------------------------------------------
create table artworks (
  id          uuid primary key default gen_random_uuid(),
  -- Slug único (não traduzido): um link compartilhado funciona nos dois idiomas.
  slug        text  not null unique,

  title       jsonb not null check (has_default_locale(title)),
  description jsonb not null default '{"pt": ""}',
  content     jsonb not null default '{"pt": ""}',
  technique   jsonb not null default '{"pt": ""}',

  -- Chave estável; o rótulo vem de dict.categories.
  category    text  not null
                    check (category in ('illustration', 'character', 'digitalArt', 'specialDigitalArt')),
  tags        text[] not null default '{}',

  image_path  text not null,               -- caminho no Supabase Storage
  thumb_path  text,
  width       integer,
  height      integer,

  is_nsfw      boolean not null default false,
  is_featured  boolean not null default false,
  is_main      boolean not null default false,
  is_published boolean not null default true,

  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  published_at timestamptz
);

-- Só uma obra pode ser a principal da home.
create unique index artworks_single_main on artworks (is_main) where is_main;
create index artworks_public_listing on artworks (is_published, sort_order desc, created_at desc);
create index artworks_nsfw on artworks (is_nsfw) where is_published;

-- ---------------------------------------------------------------------------
-- 3. commission_tiers — tabela de preços mostrada ao público
-- ---------------------------------------------------------------------------
create table commission_tiers (
  id            uuid primary key default gen_random_uuid(),
  name          jsonb not null check (has_default_locale(name)),
  description   jsonb not null default '{"pt": ""}',
  -- {"pt": ["1 personagem", "fundo simples"], "en": [...]}
  includes      jsonb not null default '{"pt": []}',

  price_cents   integer not null check (price_cents >= 0),
  currency      text not null default 'BRL',
  delivery_days integer check (delivery_days > 0),
  -- Um pedido pesado pode consumir mais de uma vaga.
  slots_cost    integer not null default 1 check (slots_cost >= 1),
  allows_nsfw   boolean not null default false,
  sample_image_path text,
  is_active     boolean not null default true,
  sort_order    integer not null default 0
);

-- ---------------------------------------------------------------------------
-- 4. commissions — pedidos gerenciados no painel (NUNCA públicos)
--    Sem tradução: só a artista lê estes campos.
-- ---------------------------------------------------------------------------
create table commissions (
  id              uuid primary key default gen_random_uuid(),
  client_name     text not null,
  client_handle   text not null default '',
  client_platform client_platform not null default 'discord',
  tier_id         uuid references commission_tiers (id) on delete set null,

  brief           text not null default '',
  status          commission_status not null default 'queued',
  slots_cost      integer not null default 1 check (slots_cost >= 1),
  is_nsfw         boolean not null default false,

  price_cents     integer check (price_cents >= 0),
  paid            boolean not null default false,

  notes           text not null default '',
  position        integer not null default 0,   -- ordem dentro da coluna do kanban
  deadline        date,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index commissions_board on commissions (status, position);
create index commissions_active on commissions (status)
  where status in ('queued', 'sketch', 'lineart', 'coloring');

-- ---------------------------------------------------------------------------
-- Limite rígido de vagas — a regra vive no banco, não na UI
-- ---------------------------------------------------------------------------
create or replace function enforce_slot_limit()
returns trigger
language plpgsql
as $$
declare
  limit_slots integer;
  used_slots  integer;
begin
  if new.status not in ('queued', 'sketch', 'lineart', 'coloring') then
    return new;  -- sair de produção sempre pode
  end if;

  -- FOR UPDATE serializa duas gravações simultâneas na mesma checagem.
  select max_slots into limit_slots from site_settings where id = true for update;

  select coalesce(sum(slots_cost), 0) into used_slots
  from commissions
  where status in ('queued', 'sketch', 'lineart', 'coloring')
    and id <> new.id;

  if used_slots + new.slots_cost > limit_slots then
    raise exception
      'Limite de comissões atingido: % de % vagas em uso.', used_slots, limit_slots
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create trigger trg_enforce_slot_limit
  before insert or update of status, slots_cost on commissions
  for each row execute function enforce_slot_limit();

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_commissions_touch
  before update on commissions
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Endpoint público de vagas: devolve só números, nunca dados de cliente
-- ---------------------------------------------------------------------------
create or replace function public_slot_status()
returns table (max_slots integer, used_slots integer, mode commissions_mode)
language sql
security definer
set search_path = public
stable
as $$
  select
    s.max_slots,
    (select coalesce(sum(c.slots_cost), 0)::integer
       from commissions c
      where c.status in ('queued', 'sketch', 'lineart', 'coloring')),
    s.commissions_mode
  from site_settings s
  where s.id = true;
$$;

grant execute on function public_slot_status() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS — público lê obras/preços/config; comissões só a artista
-- ---------------------------------------------------------------------------
alter table site_settings     enable row level security;
alter table artworks          enable row level security;
alter table commission_tiers  enable row level security;
alter table commissions       enable row level security;

create policy "settings públicos" on site_settings
  for select using (true);
create policy "settings editáveis pela artista" on site_settings
  for update to authenticated using (true) with check (true);

create policy "obras publicadas são públicas" on artworks
  for select using (is_published);
create policy "artista gerencia obras" on artworks
  for all to authenticated using (true) with check (true);

create policy "preços ativos são públicos" on commission_tiers
  for select using (is_active);
create policy "artista gerencia preços" on commission_tiers
  for all to authenticated using (true) with check (true);

-- Sem policy de SELECT para anon: nome de cliente e anotações nunca vazam.
create policy "artista gerencia comissões" on commissions
  for all to authenticated using (true) with check (true);
