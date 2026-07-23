"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/types/artwork";

export function ArtCard({ art, priority = false }: { art: Artwork; priority?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const favorited = hydrated && isFavorite(art.id);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -8, ry: px * 10 });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="glass group relative overflow-hidden rounded-2xl"
    >
      <Link href={`/galeria/${art.slug}`} className="block" data-cursor="interactive">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={art.imagem}
            alt={art.titulo}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
          {art.principal && (
            <Badge className="absolute left-3 top-3 border-none bg-[var(--neon-violet)] text-white">
              ✦ Principal
            </Badge>
          )}
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium leading-tight">{art.titulo}</h3>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{art.descricao}</p>
          <Badge variant="outline" className="border-white/15 text-xs text-muted-foreground">
            {art.categoria}
          </Badge>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(art.id)}
        aria-label="Favoritar obra"
        data-cursor="interactive"
        className={cn(
          "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur transition-colors",
          favorited ? "text-[var(--neon-cyan)]" : "text-white/80 hover:text-white"
        )}
      >
        <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
      </button>
    </motion.div>
  );
}
