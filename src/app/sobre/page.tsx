import Image from "next/image";
import type { Metadata } from "next";
import { Globe, Link2, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { artist } from "@/data/artist";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { localizedText } from "@/i18n/localized";
import { getSiteSettings } from "@/server/settings";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a artista Jessica e o processo por trás da Galeria da Jessica.",
};

const socialIcons = [Globe, Share2, Link2];

export default async function SobrePage() {
  const settings = await getSiteSettings();
  // Bio vinda do painel; se estiver vazia, o texto do perfil segue valendo.
  const bio = localizedText(settings.aboutText, DEFAULT_LOCALE) || artist.bio;

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Sobre a <span className="text-gradient-aurora">artista</span>
        </h1>
      </ScrollReveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
        <ScrollReveal>
          <div className="glow-violet relative mx-auto h-48 w-48 overflow-hidden rounded-full ring-2 ring-[var(--neon-violet)]/40">
            <Image src={artist.foto} alt={artist.nome} fill className="object-cover" />
          </div>
          <div className="mt-6 flex justify-center gap-3 lg:justify-start">
            {artist.redesSociais.map((rede, index) => {
              const Icon = socialIcons[index % socialIcons.length];
              return (
                <a
                  key={rede.label}
                  href={rede.href}
                  aria-label={rede.label}
                  data-cursor="interactive"
                  className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-2xl font-semibold">{artist.nome}</h2>
          <p className="text-muted-foreground">{artist.estilo}</p>
          <p className="mt-4 text-muted-foreground">{bio}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {artist.ferramentas.map((tool) => (
              <Badge key={tool} variant="outline" className="border-white/15 text-muted-foreground">
                {tool}
              </Badge>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {artist.estatisticas.map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <p className="text-xl font-semibold text-gradient-aurora">{stat.valor}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* TIMELINE */}
      <section className="mt-24">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold tracking-tight">Linha do tempo</h2>
        </ScrollReveal>
        <div className="relative mt-10 space-y-10 border-l border-white/10 pl-8">
          {artist.timeline.map((entry, index) => (
            <ScrollReveal key={entry.ano} delay={index * 0.1}>
              <div className="relative">
                <span className="glow-cyan absolute -left-[2.55rem] top-1 h-3 w-3 rounded-full bg-[var(--neon-cyan)]" />
                <p className="text-sm font-medium text-[var(--neon-cyan)]">{entry.ano}</p>
                <h3 className="mt-1 text-lg font-semibold">{entry.titulo}</h3>
                <p className="mt-1 max-w-xl text-muted-foreground">{entry.descricao}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* DESENVOLVEDOR */}
      <section className="glass mt-24 rounded-3xl p-8 sm:p-12">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold tracking-tight">Sobre o desenvolvedor</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Este projeto foi reconstruído por <strong className="text-foreground">João Vitor Alves Araujo</strong>,
            evoluindo de um trabalho acadêmico de Desenvolvimento Web para uma plataforma completa dedicada a
            exibir e divulgar o trabalho artístico da Jessica.
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
