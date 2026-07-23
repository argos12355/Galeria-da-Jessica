import type { Metadata } from "next";

import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { FavoritesList } from "@/features/favorites/FavoritesList";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Suas obras favoritas na Galeria da Jessica.",
};

export default function FavoritosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Seus <span className="text-gradient-aurora">favoritos</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Obras que você salvou para revisitar mais tarde.
        </p>
      </ScrollReveal>

      <div className="mt-12">
        <FavoritesList />
      </div>
    </div>
  );
}
