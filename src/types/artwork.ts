export type Category = "Ilustração" | "Personagem" | "Arte Digital" | "Arte Digital Especial";

export interface ProcessImage {
  id: number;
  titulo: string;
  imagem: string;
}

export interface Artwork {
  id: number;
  slug: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  categoria: Category;
  tags: string[];
  autor: string;
  data: string;
  tecnica: string;
  dimensoes: string;
  destaque: boolean;
  principal: boolean;
  imagem: string;
  curtidas: number;
  processo: ProcessImage[];
}

export interface TimelineEntry {
  ano: string;
  titulo: string;
  descricao: string;
}

export interface Artist {
  nome: string;
  foto: string;
  estilo: string;
  bio: string;
  ferramentas: string[];
  especialidade: string;
  desde: string;
  redesSociais: { label: string; href: string }[];
  estatisticas: { label: string; valor: string }[];
  timeline: TimelineEntry[];
}
