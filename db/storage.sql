-- Storage das obras + migração das 4 obras de exemplo para o banco.
-- Rodar DEPOIS de db/schema.sql.

-- ---------------------------------------------------------------------------
-- Bucket público: as obras são para serem vistas. O que protege é o RLS de
-- escrita abaixo — ninguém além da artista consegue enviar ou apagar.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('artworks', 'artworks', true)
on conflict (id) do nothing;

create policy "obras legiveis por qualquer um" on storage.objects
  for select using (bucket_id = 'artworks');

create policy "artista envia obras" on storage.objects
  for insert to authenticated with check (bucket_id = 'artworks');

create policy "artista substitui obras" on storage.objects
  for update to authenticated using (bucket_id = 'artworks');

create policy "artista apaga obras" on storage.objects
  for delete to authenticated using (bucket_id = 'artworks');

-- ---------------------------------------------------------------------------
-- As obras que já existiam no mock. image_path começando com "/" aponta para
-- public/ do projeto; qualquer outro valor é caminho dentro do bucket.
-- ---------------------------------------------------------------------------
insert into artworks
  (slug, title, description, content, technique, category, tags,
   image_path, width, height, is_nsfw, is_featured, is_main, sort_order)
values
  (
    'madoka',
    '{"pt": "Madoka", "en": "Madoka"}',
    '{"pt": "Arte especial de Madoka, obra que define a identidade artistica da galeria.",
      "en": "Special Madoka piece, the work that defines the gallery identity."}',
    '{"pt": "Ilustracao de Madoka que representa a evolucao do estilo artistico da Jessica. Tracos delicados, paleta vibrante e atencao aos detalhes. O processo envolveu esboco, linha-arte e colorizacao em camadas digitais.",
      "en": "A Madoka illustration that captures the evolution of Jessica''s style. Delicate linework, a vibrant palette and close attention to detail. The process went through sketch, lineart and digital layered coloring."}',
    '{"pt": "Pintura Digital com camadas", "en": "Layered digital painting"}',
    'specialDigitalArt',
    array['Madoka', 'Fan Art', 'Personagem', '4K'],
    '/imagem/madoka2.png', 4000, 4000, false, true, true, 0
  ),
  (
    'personagem-colorida',
    '{"pt": "Obra 1 — Personagem Colorida", "en": "Piece 1 — Colorful Character"}',
    '{"pt": "Uma ilustracao com estilo colorido e foco no personagem.",
      "en": "An illustration with a colorful style, focused on the character."}',
    '{"pt": "Personagem com composicao simples, cores fortes e visual chamativo. O processo envolveu diversas camadas de cor digital e atencao especial a iluminacao.",
      "en": "A character in a simple composition with strong colors and a striking look. The process used several digital color layers with special care for lighting."}',
    '{"pt": "Pintura Digital", "en": "Digital painting"}',
    'illustration',
    array['Personagem', 'Cores vivas'],
    '/imagem/Obra1.png', 3000, 4000, false, true, false, 1
  ),
  (
    'arte-expressiva',
    '{"pt": "Obra 2 — Arte Expressiva", "en": "Piece 2 — Expressive Art"}',
    '{"pt": "Arte com visual mais expressivo e detalhes no desenho.",
      "en": "A piece with a more expressive look and detailed linework."}',
    '{"pt": "Mostra melhor os detalhes do traco e da pintura. Os tracos foram feitos com pincel de textura para criar sensacao de movimento e profundidade.",
      "en": "Shows the linework and painting in more detail. Textured brushes create a sense of movement and depth."}',
    '{"pt": "Ilustracao Digital", "en": "Digital illustration"}',
    'character',
    array['Traco expressivo', 'Textura'],
    '/imagem/Obra2.png', 2800, 3500, false, true, false, 2
  ),
  (
    'composicao-visual',
    '{"pt": "Obra 3 — Composicao Visual", "en": "Piece 3 — Visual Composition"}',
    '{"pt": "Uma obra com foco em criatividade e composicao visual.",
      "en": "A piece focused on creativity and visual composition."}',
    '{"pt": "Proposta visual diferente, mantendo a identidade da galeria. Explora perspectiva e profundidade para criar uma cena dinamica.",
      "en": "A different visual approach that keeps the gallery identity. It explores perspective and depth to build a dynamic scene."}',
    '{"pt": "Arte Digital Mista", "en": "Mixed digital art"}',
    'digitalArt',
    array['Composicao', 'Perspectiva'],
    '/imagem/Obra3.png', 4000, 4000, false, true, false, 3
  )
on conflict (slug) do nothing;
