import type { Artist } from "@/types/artwork";

/**
 * Perfil da artista. Ainda estático: as colunas de personalização já existem
 * em site_settings, mas a tela do painel para editá-las não foi feita.
 */
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
