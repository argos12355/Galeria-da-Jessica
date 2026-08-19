-- Dados iniciais da Galeria da Jessica.
-- Rodar DEPOIS de db/schema.sql, no SQL Editor do Supabase.
--
-- Troque os links de contato pelos reais antes de rodar (ou edite depois
-- pelo painel). O Discord usa o ID numérico: ative o Modo Desenvolvedor no
-- Discord, clique com o botão direito no seu perfil e "Copiar ID".

update site_settings set
  site_title = '{"pt": "Galeria da Jessica", "en": "Jessica''s Gallery"}',
  tagline = '{
    "pt": "Ilustração digital autoral",
    "en": "Original digital illustration"
  }',
  commission_rules = '{
    "pt": [
      "Pagamento de 50% adiantado, 50% na entrega da arte final.",
      "Faço até 2 rodadas de ajustes durante o sketch — depois da lineart, mudanças grandes viram novo pedido.",
      "Prazo médio de 7 a 14 dias, contados a partir da aprovação do sketch.",
      "Não faço: gore pesado, conteúdo com menores e fan art de conteúdo ofensivo.",
      "A arte final é para uso pessoal. Uso comercial tem valor à parte — me chama para combinar."
    ],
    "en": [
      "50% upfront, 50% on delivery of the final artwork.",
      "Up to 2 rounds of revisions during the sketch stage — after lineart, major changes count as a new commission.",
      "Turnaround is usually 7 to 14 days, counted from sketch approval.",
      "I don''t draw: heavy gore, content involving minors, or offensive fan art.",
      "Final artwork is for personal use. Commercial use is priced separately — message me to arrange it."
    ]
  }',
  discord_url    = 'https://discord.com/users/497770106781171734',
  discord_handle = 'jessica',
  twitter_url    = 'https://x.com/HitsujiShion',
  twitter_handle = '@HitsujiShion',
  max_slots        = 5,
  commissions_mode = 'auto'
where id = true;

insert into commission_tiers
  (name, description, includes, price_cents, currency, delivery_days, slots_cost, allows_nsfw, sort_order)
values
  (
    '{"pt": "Ícone", "en": "Icon"}',
    '{"pt": "Busto do personagem, ideal para foto de perfil.",
      "en": "Character bust, perfect for a profile picture."}',
    '{"pt": ["1 personagem", "Fundo sólido ou simples", "Arquivo em 2000 x 2000 px"],
      "en": ["1 character", "Solid or simple background", "2000 x 2000 px file"]}',
    8000, 'BRL', 7, 1, false, 0
  ),
  (
    '{"pt": "Meio corpo", "en": "Half body"}',
    '{"pt": "Personagem da cintura para cima, com pintura completa.",
      "en": "Character from the waist up, fully painted."}',
    '{"pt": ["1 personagem", "Fundo simples com cor", "Arquivo em 3000 x 4000 px"],
      "en": ["1 character", "Simple colored background", "3000 x 4000 px file"]}',
    15000, 'BRL', 10, 1, true, 1
  ),
  (
    '{"pt": "Corpo inteiro + cenário", "en": "Full body + scene"}',
    '{"pt": "Ilustração completa com cenário detalhado. Ocupa 2 vagas.",
      "en": "Full illustration with a detailed scene. Takes up 2 slots."}',
    '{"pt": ["Até 2 personagens", "Cenário detalhado", "Arquivo em 4000 x 4000 px", "Arquivo de processo"],
      "en": ["Up to 2 characters", "Detailed scene", "4000 x 4000 px file", "Process file"]}',
    32000, 'BRL', 21, 2, true, 2
  );
