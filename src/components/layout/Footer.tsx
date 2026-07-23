import Link from "next/link";
import { Sparkles } from "lucide-react";

import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-[var(--neon-cyan)]" />
            <span className="text-gradient-aurora">{SITE_NAME}</span>
          </Link>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Uma galeria digital dedicada às ilustrações de personagens da artista Jessica.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          Desenvolvido por <strong className="text-foreground">João Vitor Alves Araujo</strong> · 2026
        </p>
      </div>
    </footer>
  );
}
