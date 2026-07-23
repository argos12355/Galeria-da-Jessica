"use client";

import Link from "next/link";
import { HeartCrack } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArtCard } from "@/features/gallery/ArtCard";
import { useFavorites } from "@/hooks/useFavorites";
import { getAllArtworks } from "@/services/mockArtService";

export function FavoritesList() {
  const { favorites, hydrated } = useFavorites();
  const artworks = getAllArtworks().filter((art) => favorites.includes(art.id));

  if (!hydrated) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/5] rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-4 rounded-3xl px-6 py-20 text-center">
        <HeartCrack className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">Você ainda não possui itens favoritos.</p>
        <Button className="rounded-full" render={<Link href="/galeria" />}>
          Explorar galeria
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((art) => (
        <ArtCard key={art.id} art={art} />
      ))}
    </div>
  );
}
