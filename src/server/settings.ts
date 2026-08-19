import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Localized } from "@/i18n/localized";

export type LayoutVariant = "grid" | "masonry" | "carousel";

export interface SiteSettings {
  siteTitle: Localized;
  tagline: Localized;
  aboutText: Localized;
  colorPrimary: string;
  colorBackground: string;
  colorAccent: string;
  fontHeading: string;
  layoutVariant: LayoutVariant;
}

/** Valores do globals.css: sem banco, o site fica exatamente como está hoje. */
export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: { pt: "Galeria da Jessica" },
  tagline: { pt: "Ilustração digital autoral" },
  aboutText: {},
  colorPrimary: "#a855f7",
  colorBackground: "#0d0b12",
  colorAccent: "#22d3ee",
  fontHeading: "Geist",
  layoutVariant: "grid",
};

interface SettingsRow {
  site_title: Localized;
  tagline: Localized;
  about_text: Localized;
  color_primary: string;
  color_background: string;
  color_accent: string;
  font_heading: string;
  layout_variant: LayoutVariant;
}

/** cache() dedupe: layout, header e páginas leem sem repetir a query. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "site_title, tagline, about_text, color_primary, color_background, color_accent, font_heading, layout_variant",
    )
    .eq("id", true)
    .single<SettingsRow>();

  if (error || !data) return DEFAULT_SETTINGS;

  return {
    siteTitle: data.site_title,
    tagline: data.tagline,
    aboutText: data.about_text,
    colorPrimary: data.color_primary,
    colorBackground: data.color_background,
    colorAccent: data.color_accent,
    fontHeading: data.font_heading,
    layoutVariant: data.layout_variant,
  };
});

/**
 * Converte as cores em variáveis CSS para o <html>.
 *
 * Vai no atributo style porque declaração inline vence a classe .dark do
 * globals.css sem precisar de !important.
 */
export function themeStyle(settings: SiteSettings): React.CSSProperties {
  return {
    "--neon-violet": settings.colorPrimary,
    "--neon-cyan": settings.colorAccent,
    "--background": settings.colorBackground,
    "--primary": settings.colorPrimary,
  } as React.CSSProperties;
}
