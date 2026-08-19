import type { Dictionary } from "@/i18n/config";

export const SITE_NAME = "Galeria da Jessica";

/** `key` aponta para `dict.nav` — o rótulo depende do idioma ativo. */
export const NAV_LINKS: { key: keyof Dictionary["nav"]; href: string }[] = [
  { key: "home", href: "/" },
  { key: "gallery", href: "/galeria" },
  { key: "commissions", href: "/comissoes" },
  { key: "about", href: "/sobre" },
  { key: "favorites", href: "/favoritos" },
];
