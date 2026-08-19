"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";
import { NAV_LINKS } from "@/lib/constants";
import { localizedText } from "@/i18n/localized";
import type { Localized } from "@/i18n/localized";

export function Footer({ siteTitle }: { siteTitle: Localized }) {
  const { dict, locale } = useI18n();
  const name = localizedText(siteTitle, locale);

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

        <p className="text-xs text-muted-foreground">
          {dict.footer.developedBy}{" "}
          <strong className="text-foreground">João Vitor Alves Araujo</strong> · 2026
        </p>
      </div>
    </footer>
  );
}
