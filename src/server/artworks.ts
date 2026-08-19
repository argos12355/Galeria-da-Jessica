import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Localized } from "@/i18n/localized";
import type { Artwork, Category } from "@/types/artwork";

interface ArtworkRow {
  id: string;
  slug: string;
  title: Localized;
  description: Localized;
  content: Localized;
  technique: Localized;
  category: Category;
  tags: string[];
  image_path: string;
  width: number | null;
  height: number | null;
  is_nsfw: boolean;
  is_featured: boolean;
  is_main: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

/**
 * Caminho começando com "/" é arquivo local em public/ — é assim que as obras
 * antigas continuam funcionando sem precisar reenviar tudo para o Storage.
 */
export function resolveImageUrl(
  path: string,
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
): string {
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return supabase.storage.from("artworks").getPublicUrl(path).data.publicUrl;
}

function toArtwork(
  row: ArtworkRow,
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
): Artwork {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    technique: row.technique,
    category: row.category,
    tags: row.tags,
    imageUrl: resolveImageUrl(row.image_path, supabase),
    width: row.width,
    height: row.height,
    isNsfw: row.is_nsfw,
    isFeatured: row.is_featured,
    isMain: row.is_main,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

/**
 * Todas as obras visíveis ao público. A policy de RLS já filtra as não
 * publicadas — quando a artista está logada, ela recebe as dela também.
 */
export async function getArtworks(): Promise<Artwork[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<ArtworkRow[]>();

  if (error || !data) return [];

  return data.map((row) => toArtwork(row, supabase));
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<ArtworkRow>();

  if (error || !data) return null;

  return toArtwork(data, supabase);
}

export function getMainArtwork(artworks: Artwork[]): Artwork | undefined {
  return artworks.find((art) => art.isMain);
}

export function getFeaturedArtworks(artworks: Artwork[]): Artwork[] {
  return artworks.filter((art) => art.isFeatured && !art.isMain);
}

/** Relacionadas: mesma categoria primeiro, completando com o resto. */
export function getRelatedArtworks(current: Artwork, all: Artwork[], limit = 3): Artwork[] {
  const others = all.filter((art) => art.id !== current.id);
  const sameCategory = others.filter((art) => art.category === current.category);
  const rest = others.filter((art) => art.category !== current.category);

  return [...sameCategory, ...rest].slice(0, limit);
}
