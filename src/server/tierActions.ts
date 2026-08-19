"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getArtistSession } from "./auth";
import type { ActionState } from "./actionState";

function localizedPair(pt: string, en: string): Record<string, string> {
  return en.trim() ? { pt, en: en.trim() } : { pt };
}

/** Lista em jsonb: {"pt": ["item", "item"], "en": [...]}. */
function localizedList(pt: string, en: string): Record<string, string[]> {
  const split = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const ptItems = split(pt);
  const enItems = split(en);
  return enItems.length > 0 ? { pt: ptItems, en: enItems } : { pt: ptItems };
}

function parseNumber(value: FormDataEntryValue | null): number | null {
  const parsed = Number.parseFloat(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Campos compartilhados por criar e editar. */
function readTierFields(formData: FormData) {
  const namePt = String(formData.get("namePt") ?? "").trim();
  const priceReais = parseNumber(formData.get("price"));

  if (!namePt || priceReais === null || priceReais < 0) return null;

  const deliveryDays = parseNumber(formData.get("deliveryDays"));
  const slotsCost = parseNumber(formData.get("slotsCost"));

  return {
    name: localizedPair(namePt, String(formData.get("nameEn") ?? "")),
    description: localizedPair(
      String(formData.get("descriptionPt") ?? "").trim(),
      String(formData.get("descriptionEn") ?? ""),
    ),
    includes: localizedList(
      String(formData.get("includesPt") ?? ""),
      String(formData.get("includesEn") ?? ""),
    ),
    // Reais na tela, centavos no banco.
    price_cents: Math.round(priceReais * 100),
    delivery_days: deliveryDays && deliveryDays > 0 ? Math.round(deliveryDays) : null,
    slots_cost: Math.max(1, Math.round(slotsCost ?? 1)),
    allows_nsfw: formData.get("allowsNsfw") === "on",
    is_active: formData.get("isActive") === "on",
    sort_order: Math.round(parseNumber(formData.get("sortOrder")) ?? 0),
  };
}

export async function createTierAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getArtistSession())) return { error: "unauthorized", ok: false };

  const fields = readTierFields(formData);
  if (!fields) return { error: "invalid", ok: false };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("commission_tiers").insert(fields);

  if (error) return { error: "failed", ok: false };

  revalidateTierViews();
  return { error: null, ok: true };
}

export async function updateTierAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getArtistSession())) return { error: "unauthorized", ok: false };

  const id = String(formData.get("id") ?? "");
  const fields = readTierFields(formData);
  if (!id || !fields) return { error: "invalid", ok: false };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("commission_tiers").update(fields).eq("id", id);

  if (error) return { error: "failed", ok: false };

  revalidateTierViews();
  return { error: null, ok: true };
}

export async function deleteTierAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getArtistSession())) return { error: "unauthorized", ok: false };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "invalid", ok: false };

  const supabase = await createSupabaseServerClient();
  // Comissoes que apontam para o pacote nao somem: o FK e "on delete set null".
  const { error } = await supabase.from("commission_tiers").delete().eq("id", id);

  if (error) return { error: "failed", ok: false };

  revalidateTierViews();
  return { error: null, ok: true };
}

function revalidateTierViews(): void {
  revalidatePath("/comissoes");
  revalidatePath("/painel/precos");
  revalidatePath("/painel/comissoes");
}
