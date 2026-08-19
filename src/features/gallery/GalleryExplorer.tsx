"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";
import { localizedText } from "@/i18n/localized";
import { Input } from "@/components/ui/input";
import type { LayoutVariant } from "@/server/settings";
import { CATEGORIES, categoryLabel } from "@/types/artwork";
import type { Artwork, Category } from "@/types/artwork";

import { ArtCard } from "./ArtCard";

/** Cada variante é só uma troca de classes — sem biblioteca de layout. */
const LAYOUT_CLASSES: Record<LayoutVariant, string> = {
  grid: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
  masonry: "columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid",
  carousel:
    "flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [&>*]:w-72 [&>*]:shrink-0 [&>*]:snap-start",
};

export function GalleryExplorer({
  artworks,
  initialQuery = "",
  layout = "masonry",
}: {
  artworks: Artwork[];
  initialQuery?: string;
  layout?: LayoutVariant;
}) {
  const { dict, locale } = useI18n();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category | "todas">("todas");

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();

    return artworks.filter((art) => {
      const matchesText =
        !text ||
        localizedText(art.title, locale).toLowerCase().includes(text) ||
        localizedText(art.description, locale).toLowerCase().includes(text) ||
        art.tags.some((tag) => tag.toLowerCase().includes(text));

      return matchesText && (category === "todas" || art.category === category);
    });
  }, [artworks, query, category, locale]);

  return (
    <div>
      <div className="glass mb-10 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.gallery.searchPlaceholder}
            aria-label={dict.gallery.searchPlaceholder}
            className="border-white/10 bg-white/5 pl-9"
          />
        </div>

        {/* <select> nativo: navegável por teclado sem JavaScript extra. */}
        <label htmlFor="category" className="sr-only">
          {dict.gallery.category}
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category | "todas")}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm sm:w-56"
        >
          <option value="todas">{dict.gallery.allCategories}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabel(cat, dict)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          {artworks.length === 0 ? dict.gallery.noArtworks : dict.gallery.empty}
        </p>
      ) : (
        <div className={LAYOUT_CLASSES[layout]}>
          {filtered.map((art, index) => (
            <ArtCard key={art.id} art={art} priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
