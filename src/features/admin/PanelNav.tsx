"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { signOutAction } from "@/server/authActions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PanelNav({ email }: { email: string }) {
  const { dict } = useI18n();
  const pathname = usePathname();

  const links = [
    { href: "/painel", label: dict.panel.nav.overview },
    { href: "/painel/comissoes", label: dict.panel.nav.commissions },
    { href: "/painel/obras", label: dict.panel.artworks.title },
    { href: "/painel/aparencia", label: dict.panel.appearance.title },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
      <nav className="flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              pathname === link.href && "bg-white/5 text-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {format(dict.panel.signedInAs, { email })}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 rounded-full"
          nativeButton={false}
          render={<Link href="/" />}
        >
          <ExternalLink className="h-4 w-4" />
          {dict.panel.nav.backToSite}
        </Button>

        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm" className="gap-1.5 rounded-full">
            <LogOut className="h-4 w-4" />
            {dict.panel.signOut}
          </Button>
        </form>
      </div>
    </div>
  );
}
