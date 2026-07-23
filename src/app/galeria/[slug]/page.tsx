import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArtDetailView } from "@/features/art-detail/ArtDetailView";
import { artworks, getArtworkBySlug, getRelatedArtworks } from "@/services/mockArtService";

export function generateStaticParams() {
  return artworks.map((art) => ({ slug: art.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const art = getArtworkBySlug(slug);
  if (!art) return {};
  return {
    title: art.titulo,
    description: art.descricao,
  };
}

export default async function ArtDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = getArtworkBySlug(slug);

  if (!art) {
    notFound();
  }

  const related = getRelatedArtworks(art);

  return <ArtDetailView art={art} related={related} />;
}
