"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/services/mockArtService";
import type { Artwork, Category } from "@/types/artwork";

import { ArtCard } from "./ArtCard";

export function GalleryExplorer({ artworks, initialQuery = "" }: { artworks: Artwork[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category | "todas">("todas");

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return artworks.filter((art) => {
      const matchesText =
        !text ||
        art.titulo.toLowerCase().includes(text) ||
        art.descricao.toLowerCase().includes(text) ||
        art.tags.some((tag) => tag.toLowerCase().includes(text));
      const matchesCategory = category === "todas" || art.categoria === category;
      return matchesText && matchesCategory;
    });
  }, [artworks, query, category]);

  return (
    <div>
      <div className="glass mb-10 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar por título, tag ou descrição..."
            className="border-white/10 bg-white/5 pl-9"
          />
        </div>
        <Select value={category} onValueChange={(value) => setCategory(value as Category | "todas")}>
          <SelectTrigger className="w-full border-white/10 bg-white/5 sm:w-56">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">Nenhuma obra encontrada para essa busca.</p>
      ) : (
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {filtered.map((art, index) => (
            <ArtCard key={art.id} art={art} priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
