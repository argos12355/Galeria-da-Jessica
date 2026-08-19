import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArtDetailView } from "@/features/art-detail/ArtDetailView";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { localizedText } from "@/i18n/localized";
import { getArtworkBySlug, getArtworks, getRelatedArtworks } from "@/server/artworks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const art = await getArtworkBySlug(slug);
  if (!art) return {};

  return {
    title: localizedText(art.title, DEFAULT_LOCALE),
    description: localizedText(art.description, DEFAULT_LOCALE),
  };
}

export default async function ArtDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = await getArtworkBySlug(slug);

  if (!art) {
    notFound();
  }

  const related = getRelatedArtworks(art, await getArtworks());

  return <ArtDetailView art={art} related={related} />;
}
