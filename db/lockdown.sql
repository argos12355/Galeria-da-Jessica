-- Trava de acesso: só a conta da artista escreve.
-- Rodar DEPOIS de db/schema.sql e db/storage.sql.
--
-- Antes disto, qualquer usuario "authenticated" tinha acesso total. Como o
-- cadastro publico do Supabase estava ligado, isso significava que qualquer
-- visitante podia criar conta e ler os dados dos clientes.

-- ---------------------------------------------------------------------------
-- Lista de contas com poder de administracao. Tabela, e nao uuid fixo dentro
-- da policy, para dar para liberar outra conta depois sem reescrever regra.
-- ---------------------------------------------------------------------------
create table if not exists artist_accounts (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table artist_accounts enable row level security;
-- Sem policy nenhuma: ninguem le esta tabela pela API. So a funcao abaixo,
-- que roda como security definer, enxerga o conteudo.

-- Semeia com a conta mais antiga do projeto, que e a da Jessica.
insert into artist_accounts (user_id)
select id from auth.users order by created_at asc limit 1
on conflict do nothing;

create or replace function is_artist()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from artist_accounts where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Troca as policies de escrita: "authenticated" vira "is_artist()"
-- ---------------------------------------------------------------------------
drop policy if exists "settings editaveis pela artista" on site_settings;
create policy "settings editaveis pela artista" on site_settings
  for update to authenticated using (is_artist()) with check (is_artist());

drop policy if exists "artista gerencia obras" on artworks;
create policy "artista gerencia obras" on artworks
  for all to authenticated using (is_artist()) with check (is_artist());

drop policy if exists "artista gerencia precos" on commission_tiers;
create policy "artista gerencia precos" on commission_tiers
  for all to authenticated using (is_artist()) with check (is_artist());

-- A mais importante: nome e valor de cliente.
drop policy if exists "artista gerencia comissoes" on commissions;
create policy "artista gerencia comissoes" on commissions
  for all to authenticated using (is_artist()) with check (is_artist());

-- ---------------------------------------------------------------------------
-- Mesma trava no Storage
-- ---------------------------------------------------------------------------
drop policy if exists "artista envia obras" on storage.objects;
create policy "artista envia obras" on storage.objects
  for insert to authenticated with check (bucket_id = 'artworks' and is_artist());

drop policy if exists "artista substitui obras" on storage.objects;
create policy "artista substitui obras" on storage.objects
  for update to authenticated using (bucket_id = 'artworks' and is_artist());

drop policy if exists "artista apaga obras" on storage.objects;
create policy "artista apaga obras" on storage.objects
  for delete to authenticated using (bucket_id = 'artworks' and is_artist());

-- Confere quem ficou com acesso (deve listar so a Jessica).
select u.email, a.created_at
from artist_accounts a
join auth.users u on u.id = a.user_id;
