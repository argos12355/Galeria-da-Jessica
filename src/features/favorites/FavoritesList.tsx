"use client";

import Link from "next/link";
import { HeartCrack } from "lucide-react";

import { ArtCard } from "@/features/gallery/ArtCard";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/useFavorites";
import type { Artwork } from "@/types/artwork";

export function FavoritesList({ artworks }: { artworks: Artwork[] }) {
  const { dict } = useI18n();
  const { favorites, hydrated } = useFavorites();

  if (!hydrated) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/5] rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  const favorited = artworks.filter((art) => favorites.includes(art.id));

  if (favorited.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-4 rounded-3xl px-6 py-20 text-center">
        <HeartCrack className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">{dict.favorites.empty}</p>
        <Button className="rounded-full" nativeButton={false} render={<Link href="/galeria" />}>
          {dict.favorites.explore}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {favorited.map((art) => (
        <ArtCard key={art.id} art={art} />
      ))}
    </div>
  );
}
