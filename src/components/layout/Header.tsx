"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, Search, Sparkles } from "lucide-react";

import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    router.push(query.trim() ? `/galeria?q=${encodeURIComponent(query.trim())}` : "/galeria");
  }

  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Sparkles className="h-5 w-5 text-[var(--neon-cyan)]" />
          <span className="text-gradient-aurora">{SITE_NAME}</span>
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
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar obra..."
              className="w-48 rounded-full border-white/10 bg-white/5 pl-9 lg:w-64"
            />
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            render={<Link href="/favoritos" aria-label="Favoritos" />}
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Button className="hidden rounded-full sm:inline-flex" render={<Link href="/login" />}>
            Entrar
          </Button>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="rounded-full md:hidden" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="glass w-72 border-l">
              <SheetTitle className="text-gradient-aurora px-4 pt-4">{SITE_NAME}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Cadastro
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
