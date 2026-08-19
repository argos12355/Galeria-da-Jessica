"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { NsfwShield } from "@/features/nsfw/NsfwShield";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedText } from "@/i18n/localized";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/types/artwork";
import type { Artwork } from "@/types/artwork";

/**
 * A obra ocupa o card inteiro; título e categoria só aparecem no hover.
 *
 * Sem framer-motion e sem o tilt 3D que existia aqui: a inclinação disputava
 * atenção com a arte e obrigava um componente cliente animado por card.
 */
export function ArtCard({ art, priority = false }: { art: Artwork; priority?: boolean }) {
  const { dict, locale } = useI18n();
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const favorited = hydrated && isFavorite(art.id);

  const title = localizedText(art.title, locale);

  const cover = (
    <div className="relative h-full w-full">
      <Image
        src={art.imageUrl}
        alt={title}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      {/* Véu que só escurece o rodapé, para o texto do hover ter contraste. */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
    </div>
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card ring-1 ring-white/5 transition-shadow duration-300 hover:ring-white/15">
      <Link
        href={`/galeria/${art.slug}`}
        className="block aspect-[4/5]"
        data-cursor="interactive"
      >
        {art.isNsfw ? <NsfwShield>{cover}</NsfwShield> : cover}

        {/*
          Variantes nativas do Tailwind em vez de CSS proprio: o v4 descarta
          seletores compostos escritos dentro de @layer utilities.
          O texto fica sempre no DOM — muda so a opacidade, entao leitor de
          tela le normalmente. Em tela de toque, onde hover nao existe, o
          rotulo aparece direto.
        */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-2 p-4 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
          <h3 className="text-sm font-medium leading-tight text-white">{title}</h3>
          <p className="mt-1 text-xs text-white/70">{categoryLabel(art.category, dict)}</p>
        </div>
      </Link>

      {art.isMain && (
        <Badge className="pointer-events-none absolute left-3 top-3 z-20 border-none bg-black/50 text-white backdrop-blur">
          ✦
        </Badge>
      )}

      {/* Favoritar é ação, não rótulo: fica sempre acessível. */}
      <button
        type="button"
        onClick={() => toggleFavorite(art.id)}
        aria-label={dict.artDetail.favorite}
        aria-pressed={favorited}
        data-cursor="interactive"
        className={cn(
          "absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur transition-colors",
          favorited ? "text-[var(--neon-cyan)]" : "text-white/70 hover:text-white",
        )}
      >
        <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
      </button>
    </div>
  );
}
