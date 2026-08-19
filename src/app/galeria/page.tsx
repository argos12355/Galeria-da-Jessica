import type { Metadata } from "next";

import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { GalleryExplorer } from "@/features/gallery/GalleryExplorer";
import { getArtworks } from "@/server/artworks";
import { getSiteSettings } from "@/server/settings";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Explore todas as obras da Galeria da Jessica — ilustrações, personagens e arte digital.",
};

export default async function GaleriaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [artworks, settings] = await Promise.all([getArtworks(), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Todas as <span className="text-gradient-aurora">obras</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Pesquise por título, tag ou filtre por categoria para explorar a galeria completa.
        </p>
      </ScrollReveal>

      <div className="mt-12">
        <GalleryExplorer
          artworks={artworks}
          initialQuery={q ?? ""}
          layout={settings.layoutVariant}
        />
      </div>
    </div>
  );
}
