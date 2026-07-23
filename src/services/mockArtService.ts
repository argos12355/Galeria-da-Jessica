import type { Artist, Artwork, Category } from "@/types/artwork";

export const artist: Artist = {
  nome: "Jessica",
  foto: "/imagem/ProfileJessica.png",
  estilo: "Ilustradora Digital · Criadora de Personagens",
  bio: "Jessica é uma artista digital especializada em ilustrações de personagens com cores vivas e traços expressivos. Seu trabalho mistura influências do estilo anime com técnicas de pintura digital moderna, criando composições únicas cheias de personalidade.",
  ferramentas: ["Clip Studio Paint", "Medibang"],
  especialidade: "Personagens e Ilustrações",
  desde: "2024",
  redesSociais: [
    { label: "Instagram", href: "#" },
    { label: "ArtStation", href: "#" },
    { label: "Twitter/X", href: "#" },
  ],
  estatisticas: [
    { label: "Obras publicadas", valor: "4+" },
    { label: "Anos de prática", valor: "2+" },
    { label: "Estilo principal", valor: "Anime" },
  ],
  timeline: [
    { ano: "2024", titulo: "Início da jornada", descricao: "Primeiros passos na ilustração digital, explorando ferramentas e estilo próprio." },
    { ano: "2025", titulo: "Consolidação do estilo", descricao: "Desenvolvimento de uma identidade visual marcante, com traços expressivos e paleta vibrante." },
    { ano: "2026", titulo: "Obra principal — Madoka", descricao: "Criação da peça que define a identidade artística da galeria." },
  ],
};

export const categories: Category[] = ["Ilustração", "Personagem", "Arte Digital", "Arte Digital Especial"];

export const artworks: Artwork[] = [
  {
    id: 0,
    slug: "madoka",
    titulo: "Madoka",
    descricao: "Arte especial de Madoka, obra que define a identidade artística da galeria.",
    conteudo:
      "Esta é a obra mais especial da galeria — uma ilustração de Madoka que representa a evolução do estilo artístico da Jessica. Com traços delicados, paleta de cores vibrante e atenção minuciosa aos detalhes, essa arte captura a essência do trabalho da artista. O processo envolveu esboço, linha-arte e colorização em camadas digitais.",
    categoria: "Arte Digital Especial",
    tags: ["Madoka", "Fan Art", "Personagem", "4K"],
    autor: "Jessica",
    data: "2026-05-18",
    tecnica: "Pintura Digital com camadas",
    dimensoes: "4000 x 4000 px (4K)",
    destaque: true,
    principal: true,
    imagem: "/imagem/madoka2.png",
    curtidas: 128,
    processo: [{ id: 3, titulo: "Versão colorida final", imagem: "/imagem/madoka2.png" }],
  },
  {
    id: 1,
    slug: "personagem-colorida",
    titulo: "Obra 1 — Personagem Colorida",
    descricao: "Uma ilustração com estilo colorido e foco no personagem.",
    conteudo:
      "Essa obra foi feita para mostrar uma personagem com uma composição simples, usando cores fortes e um visual chamativo. A ideia principal é destacar a arte e o estilo da artista. O processo envolveu diversas camadas de cor digital e atenção especial à iluminação do personagem.",
    categoria: "Ilustração",
    tags: ["Personagem", "Cores vivas"],
    autor: "Jessica",
    data: "2026-05-20",
    tecnica: "Pintura Digital",
    dimensoes: "3000 x 4000 px",
    destaque: true,
    principal: false,
    imagem: "/imagem/Obra1.png",
    curtidas: 76,
    processo: [{ id: 3, titulo: "Versão colorida", imagem: "/imagem/Obra1.png" }],
  },
  {
    id: 2,
    slug: "arte-expressiva",
    titulo: "Obra 2 — Arte Expressiva",
    descricao: "Arte com um visual mais expressivo e detalhes no desenho.",
    conteudo:
      "Essa segunda obra mostra melhor os detalhes do traço e da pintura. Ela pode ser usada como exemplo de evolução do estilo artístico da Jessica. Os traços foram feitos com pincel de textura para criar uma sensação de movimento e profundidade na composição.",
    categoria: "Personagem",
    tags: ["Traço expressivo", "Textura"],
    autor: "Jessica",
    data: "2026-05-21",
    tecnica: "Ilustração Digital",
    dimensoes: "2800 x 3500 px",
    destaque: true,
    principal: false,
    imagem: "/imagem/Obra2.png",
    curtidas: 54,
    processo: [
      { id: 1, titulo: "Rascunho", imagem: "/imagem/Obra2rascunho.png" },
      { id: 2, titulo: "Detalhes do traço", imagem: "/imagem/Obra2detalhamento.png" },
      { id: 3, titulo: "Arte final", imagem: "/imagem/Obra2.png" },
    ],
  },
  {
    id: 3,
    slug: "composicao-visual",
    titulo: "Obra 3 — Composição Visual",
    descricao: "Uma obra com foco em criatividade e composição visual.",
    conteudo:
      "A terceira obra apresenta uma proposta visual diferente, mantendo a identidade da galeria. Ela ajuda a mostrar a variedade das artes criadas pela artista. A composição explora o uso de perspectiva e profundidade para criar uma cena dinâmica e envolvente.",
    categoria: "Arte Digital",
    tags: ["Composição", "Perspectiva"],
    autor: "Jessica",
    data: "2026-05-22",
    tecnica: "Arte Digital Mista",
    dimensoes: "4000 x 4000 px",
    destaque: true,
    principal: false,
    imagem: "/imagem/Obra3.png",
    curtidas: 41,
    processo: [{ id: 3, titulo: "Resultado final", imagem: "/imagem/Obra3.png" }],
  },
];

export function getAllArtworks(): Artwork[] {
  return artworks;
}

export function getFeaturedArtworks(): Artwork[] {
  return artworks.filter((art) => art.destaque && !art.principal);
}

export function getMainArtwork(): Artwork | undefined {
  return artworks.find((art) => art.principal);
}

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((art) => art.slug === slug);
}

export function getRelatedArtworks(current: Artwork, limit = 3): Artwork[] {
  return artworks
    .filter((art) => art.id !== current.id && art.categoria === current.categoria)
    .concat(artworks.filter((art) => art.id !== current.id && art.categoria !== current.categoria))
    .slice(0, limit);
}

export function searchArtworks(query: string, category: Category | "todas"): Artwork[] {
  const text = query.trim().toLowerCase();
  return artworks.filter((art) => {
    const matchesText =
      !text ||
      art.titulo.toLowerCase().includes(text) ||
      art.descricao.toLowerCase().includes(text) ||
      art.tags.some((tag) => tag.toLowerCase().includes(text));
    const matchesCategory = category === "todas" || art.categoria === category;
    return matchesText && matchesCategory;
  });
}
