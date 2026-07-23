"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Maximize2, Share2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { ArtCard } from "@/features/gallery/ArtCard";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/types/artwork";

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function ArtDetailView({ art, related }: { art: Artwork; related: Artwork[] }) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const [fullscreen, setFullscreen] = useState(false);
  const favorited = hydrated && isFavorite(art.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <ScrollReveal>
          <div className="glow-violet group relative aspect-square overflow-hidden rounded-3xl">
            <Image src={art.imagem} alt={art.titulo} fill priority className="object-cover" />
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label="Ver em tela cheia"
              data-cursor="interactive"
              className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {art.principal && (
            <Badge className="mb-4 border-none bg-[var(--neon-violet)] text-white">✦ Obra Principal</Badge>
          )}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{art.titulo}</h1>
          <Badge variant="outline" className="mt-4 border-white/15 text-muted-foreground">
            {art.categoria}
          </Badge>

          <p className="mt-6 text-muted-foreground">{art.conteudo}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {art.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button
              onClick={() => toggleFavorite(art.id)}
              variant="outline"
              className={cn(
                "rounded-full border-white/15 bg-white/5",
                favorited && "border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)]"
              )}
            >
              <Heart className={cn("mr-2 h-4 w-4", favorited && "fill-current")} />
              {favorited ? "Favoritado" : "Favoritar"}
            </Button>
            <Button variant="ghost" className="rounded-full">
              <Share2 className="mr-2 h-4 w-4" /> Compartilhar
            </Button>
            <span className="ml-auto text-sm text-muted-foreground">♥ {art.curtidas} curtidas</span>
          </div>

          <dl className="glass mt-8 grid grid-cols-2 gap-6 rounded-2xl p-6 text-sm">
            <div>
              <dt className="text-muted-foreground">Artista</dt>
              <dd className="font-medium">{art.autor}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Técnica</dt>
              <dd className="font-medium">{art.tecnica}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Dimensões</dt>
              <dd className="font-medium">{art.dimensoes}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Criado em</dt>
              <dd className="font-medium">{formatDate(art.data)}</dd>
            </div>
          </dl>

          <Link href="/galeria" className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para a galeria
          </Link>
        </ScrollReveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <ScrollReveal>
            <h2 className="text-2xl font-semibold tracking-tight">Obras relacionadas</h2>
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
            aria-label="Fechar"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-full w-full max-w-4xl">
            <Image src={art.imagem} alt={art.titulo} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
