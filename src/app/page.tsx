import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Palette, Sparkles, Wand2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GsapTextReveal } from "@/components/layout/GsapTextReveal";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { HeroCanvasClient } from "@/components/three/HeroCanvasClient";
import { ArtCard } from "@/features/gallery/ArtCard";
import { artist, getFeaturedArtworks, getMainArtwork } from "@/services/mockArtService";

export default function HomePage() {
  const featured = getFeaturedArtworks();
  const main = getMainArtwork();

  return (
    <div>
      {/* HERO */}
      <section className="aurora-bg noise-overlay relative flex min-h-[92vh] items-center overflow-hidden">
        <HeroCanvasClient />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 border-white/15 bg-white/5 text-muted-foreground" variant="outline">
            <Sparkles className="mr-1 h-3.5 w-3.5 text-[var(--neon-cyan)]" /> Ilustração digital autoral
          </Badge>
          <GsapTextReveal
            as="h1"
            className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            A galeria digital de{" "}
            <span className="text-gradient-aurora">{artist.nome}</span>
          </GsapTextReveal>
          <GsapTextReveal as="p" className="mt-6 max-w-xl text-lg text-muted-foreground">
            {artist.estilo} — ilustrações de personagens com traços expressivos, cores vibrantes
            e uma identidade visual inspirada no universo anime.
          </GsapTextReveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" className="glow-violet rounded-full text-base" render={<Link href="/galeria" />}>
              Explorar galeria <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-base"
              render={<Link href="/sobre" />}
            >
              Conhecer a artista
            </Button>
          </div>
        </div>
      </section>

      {/* OBRA PRINCIPAL */}
      {main && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Badge variant="outline" className="mb-4 border-white/15 text-muted-foreground">
              ✦ Obra em destaque
            </Badge>
          </ScrollReveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <div className="glow-violet relative aspect-square overflow-hidden rounded-3xl">
                <Image src={main.imagem} alt={main.titulo} fill className="object-cover" priority />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="text-4xl font-semibold tracking-tight">{main.titulo}</h2>
              <p className="mt-4 text-muted-foreground">{main.conteudo}</p>
              <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Técnica</dt>
                  <dd className="font-medium">{main.tecnica}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Resolução</dt>
                  <dd className="font-medium">{main.dimensoes}</dd>
                </div>
              </dl>
              <Button className="mt-8 rounded-full" render={<Link href={`/galeria/${main.slug}`} />}>
                Ver detalhes completos <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Vitrine de destaques</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Uma seleção das obras mais marcantes da galeria.
          </p>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((art, index) => (
            <ScrollReveal key={art.id} delay={index * 0.08}>
              <ArtCard art={art} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ARTISTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="glass grid gap-10 rounded-3xl p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:items-center">
          <ScrollReveal>
            <div className="glow-cyan relative mx-auto h-40 w-40 overflow-hidden rounded-full ring-2 ring-[var(--neon-cyan)]/40 sm:h-48 sm:w-48">
              <Image src={artist.foto} alt={artist.nome} fill className="object-cover" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Palette className="h-4 w-4 text-[var(--neon-violet)]" /> Artista principal
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">{artist.nome}</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">{artist.bio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {artist.estatisticas.map((stat) => (
                <div key={stat.label} className="glass rounded-xl px-4 py-2">
                  <p className="text-lg font-semibold text-gradient-aurora">{stat.valor}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-8 rounded-full border-white/15 bg-white/5"
              render={<Link href="/sobre" />}
            >
              <Wand2 className="mr-1 h-4 w-4" /> Ver perfil completo
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
