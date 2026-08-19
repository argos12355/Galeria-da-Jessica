"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, Search, Sparkles } from "lucide-react";

import { NAV_LINKS } from "@/lib/constants";
import { localizedText } from "@/i18n/localized";
import type { Localized } from "@/i18n/localized";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header({
  maybeSignedIn = false,
  siteTitle,
}: {
  maybeSignedIn?: boolean;
  siteTitle: Localized;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, locale } = useI18n();
  const name = localizedText(siteTitle, locale);
  const [query, setQuery] = useState("");

  // Se o cookie sumiu ou expirou, /painel devolve para /login — o botão só
  // encurta o caminho de quem já está dentro.
  const accountHref = maybeSignedIn ? "/painel" : "/login";
  const accountLabel = maybeSignedIn ? dict.panel.title : dict.header.signIn;

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    router.push(query.trim() ? `/galeria?q=${encodeURIComponent(query.trim())}` : "/galeria");
  }

  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Sparkles className="h-5 w-5 text-[var(--neon-cyan)]" />
          <span className="text-gradient-aurora">{name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "bg-white/5 text-foreground"
              )}
            >
              {dict.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.header.searchPlaceholder}
              className="w-48 rounded-full border-white/10 bg-white/5 pl-9 lg:w-64"
            />
          </form>

          <LocaleSwitcher />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            nativeButton={false} render={<Link href="/favoritos" aria-label={dict.header.favorites} />}
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Button
            className="hidden rounded-full sm:inline-flex"
            nativeButton={false}
            render={<Link href={accountHref} />}
          >
            {accountLabel}
          </Button>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="rounded-full md:hidden" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="glass w-72 border-l">
              <SheetTitle className="text-gradient-aurora px-4 pt-4">{name}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    {dict.nav[link.key]}
                  </Link>
                ))}
                <Link
                  href={accountHref}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {accountLabel}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
