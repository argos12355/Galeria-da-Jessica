"use client";

import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";
import { NAV_LINKS } from "@/lib/constants";
import { localizedText } from "@/i18n/localized";
import type { Localized } from "@/i18n/localized";

export function Footer({
  siteTitle,
  maybeSignedIn = false,
}: {
  siteTitle: Localized;
  maybeSignedIn?: boolean;
}) {
  const { dict, locale } = useI18n();
  const name = localizedText(siteTitle, locale);

  // Se o cookie sumiu ou expirou, /painel devolve para /login.
  const accountHref = maybeSignedIn ? "/painel" : "/login";
  const accountLabel = maybeSignedIn ? dict.panel.title : dict.header.signIn;

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-[var(--neon-cyan)]" />
            <span className="text-gradient-aurora">{name}</span>
          </Link>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{dict.footer.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {dict.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 lg:items-end">
          {/*
            Acesso da artista. Fica discreto no rodape porque o visitante nao
            tem conta — um "Entrar" grande no topo so gera tentativa frustrada.
          */}
          <Link
            href={accountHref}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            <Lock className="h-3 w-3" aria-hidden />
            {accountLabel}
          </Link>

          <p className="text-xs text-muted-foreground">
            {dict.footer.developedBy}{" "}
            <strong className="text-foreground">João Vitor Alves Araujo</strong> · 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
