import type { Dictionary } from "@/i18n/config";
import type { Localized } from "@/i18n/localized";

/** Chaves estáveis; o rótulo vem de dict.categories. */
export const CATEGORIES = [
  "illustration",
  "character",
  "digitalArt",
  "specialDigitalArt",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function categoryLabel(category: Category, dict: Dictionary): string {
  return dict.categories[category as keyof Dictionary["categories"]];
}

export interface Artwork {
  id: string;
  slug: string;
  title: Localized;
  description: Localized;
  content: Localized;
  technique: Localized;
  category: Category;
  tags: string[];
  /** Já resolvida: caminho local (/imagem/...) ou URL pública do Storage. */
  imageUrl: string;
  width: number | null;
  height: number | null;
  isNsfw: boolean;
  isFeatured: boolean;
  isMain: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
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
