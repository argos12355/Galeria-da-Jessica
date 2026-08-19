"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Maximize2, X } from "lucide-react";

import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { artist } from "@/data/artist";
import { ArtCard } from "@/features/gallery/ArtCard";
import { NsfwShield } from "@/features/nsfw/NsfwShield";
import { HTML_LANG } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedText } from "@/i18n/localized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/types/artwork";
import type { Artwork } from "@/types/artwork";

export function ArtDetailView({ art, related }: { art: Artwork; related: Artwork[] }) {
  const { dict, locale } = useI18n();
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const [fullscreen, setFullscreen] = useState(false);
  const favorited = hydrated && isFavorite(art.id);

  const title = localizedText(art.title, locale);
  const dimensions = art.width && art.height ? `${art.width} x ${art.height} px` : null;
  const createdAt = new Date(art.createdAt).toLocaleDateString(HTML_LANG[locale]);

  const cover = (
    <Image src={art.imageUrl} alt={title} fill priority className="object-cover" />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ScrollReveal>
          <div className="glow-violet group relative aspect-square overflow-hidden rounded-3xl">
            {art.isNsfw ? <NsfwShield>{cover}</NsfwShield> : cover}
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label={dict.artDetail.fullscreen}
              data-cursor="interactive"
              className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2">
            {art.isMain && (
              <Badge className="border-none bg-[var(--neon-violet)] text-white">
                {dict.artDetail.mainWork}
              </Badge>
            )}
            {art.isNsfw && (
              <Badge className="border-none bg-black/60 text-white">{dict.nsfw.badge}</Badge>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <Badge variant="outline" className="mt-4 border-white/15 text-muted-foreground">
            {categoryLabel(art.category, dict)}
          </Badge>

          <p className="mt-6 text-muted-foreground">{localizedText(art.content, locale)}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {art.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Button
              onClick={() => toggleFavorite(art.id)}
              variant="outline"
              aria-pressed={favorited}
              className={cn(
                "rounded-full border-white/15 bg-white/5",
                favorited && "border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)]",
              )}
            >
              <Heart className={cn("mr-2 h-4 w-4", favorited && "fill-current")} />
              {favorited ? dict.artDetail.favorited : dict.artDetail.favorite}
            </Button>
          </div>

          <dl className="glass mt-8 grid grid-cols-2 gap-6 rounded-2xl p-6 text-sm">
            <div>
              <dt className="text-muted-foreground">{dict.artDetail.artistLabel}</dt>
              <dd className="font-medium">{artist.nome}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{dict.artDetail.technique}</dt>
              <dd className="font-medium">{localizedText(art.technique, locale)}</dd>
            </div>
            {dimensions && (
              <div>
                <dt className="text-muted-foreground">{dict.artDetail.dimensions}</dt>
                <dd className="font-medium">{dimensions}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">{dict.artDetail.createdAt}</dt>
              <dd className="font-medium">{createdAt}</dd>
            </div>
          </dl>

          <Link
            href="/galeria"
            className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            {dict.artDetail.back}
          </Link>
        </ScrollReveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <ScrollReveal>
            <h2 className="text-2xl font-semibold tracking-tight">{dict.artDetail.related}</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.08}>
                <ArtCard art={item} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            aria-label={dict.artDetail.close}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-full w-full max-w-4xl">
            <Image src={art.imageUrl} alt={title} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
