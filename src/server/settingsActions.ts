"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getArtistSession } from "./auth";
import type { ActionState } from "./actionState";

const LAYOUTS = ["grid", "masonry", "carousel"];

/** Aceita #rgb e #rrggbb. Cor inválida quebraria o tema inteiro do site. */
function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

function localizedPair(pt: string, en: string): Record<string, string> {
  return en.trim() ? { pt, en: en.trim() } : { pt };
}

export async function updateAppearanceAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getArtistSession())) return { error: "unauthorized", ok: false };

  const colorPrimary = String(formData.get("colorPrimary") ?? "");
  const colorBackground = String(formData.get("colorBackground") ?? "");
  const colorAccent = String(formData.get("colorAccent") ?? "");

  if (![colorPrimary, colorBackground, colorAccent].every(isHexColor)) {
    return { error: "invalid", ok: false };
  }

  const siteTitlePt = String(formData.get("siteTitlePt") ?? "").trim();
  if (!siteTitlePt) return { error: "invalid", ok: false };

  const layoutVariant = String(formData.get("layoutVariant") ?? "grid");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_title: localizedPair(siteTitlePt, String(formData.get("siteTitleEn") ?? "")),
      tagline: localizedPair(
        String(formData.get("taglinePt") ?? "").trim(),
        String(formData.get("taglineEn") ?? ""),
      ),
      about_text: localizedPair(
        String(formData.get("aboutPt") ?? "").trim(),
        String(formData.get("aboutEn") ?? ""),
      ),
      color_primary: colorPrimary,
      color_background: colorBackground,
      color_accent: colorAccent,
      font_heading: String(formData.get("fontHeading") ?? "Geist").trim() || "Geist",
      layout_variant: LAYOUTS.includes(layoutVariant) ? layoutVariant : "grid",
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) return { error: "failed", ok: false };

  // O tema vive no layout raiz, então toda página muda de uma vez.
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}
