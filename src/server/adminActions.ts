"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getArtistSession } from "./auth";
import type { ActionState } from "./actionState";
import { ACTIVE_STATUSES, CLOSED_STATUSES } from "@/types/commission";
import type { ClientPlatform, CommissionStatus, CommissionsMode } from "@/types/commission";

/**
 * Server Actions são endpoints públicos: qualquer um pode chamá-las montando
 * o request na mão. O RLS já barra no banco, mas checar a sessão aqui devolve
 * erro claro em vez de falha silenciosa.
 */
async function requireArtist(): Promise<boolean> {
  return Boolean(await getArtistSession());
}

/** O trigger enforce_slot_limit levanta check_violation (SQLSTATE 23514). */
function isLimitError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "23514" || Boolean(error.message?.includes("Limite de comissões"));
}

function parseStatus(value: unknown): CommissionStatus | null {
  const all: readonly string[] = [...ACTIVE_STATUSES, ...CLOSED_STATUSES];
  return typeof value === "string" && all.includes(value) ? (value as CommissionStatus) : null;
}

function parsePlatform(value: unknown): ClientPlatform {
  return value === "twitter" || value === "other" ? value : "discord";
}

function parseIntField(value: FormDataEntryValue | null, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function createCommissionAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireArtist())) return { error: "unauthorized", ok: false };

  const clientName = String(formData.get("clientName") ?? "").trim();
  if (!clientName) return { error: "invalid", ok: false };

  // Reais na tela, centavos no banco — evita erro de ponto flutuante.
  const priceReais = Number.parseFloat(String(formData.get("price") ?? "").replace(",", "."));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("commissions").insert({
    client_name: clientName,
    client_handle: String(formData.get("clientHandle") ?? "").trim(),
    client_platform: parsePlatform(formData.get("platform")),
    tier_id: String(formData.get("tierId") ?? "") || null,
    brief: String(formData.get("brief") ?? "").trim(),
    status: parseStatus(formData.get("status")) ?? "queued",
    slots_cost: Math.max(1, parseIntField(formData.get("slotsCost"), 1)),
    is_nsfw: formData.get("isNsfw") === "on",
    price_cents: Number.isFinite(priceReais) ? Math.round(priceReais * 100) : null,
    paid: formData.get("paid") === "on",
    notes: String(formData.get("notes") ?? "").trim(),
  });

  if (isLimitError(error)) return { error: "limit_reached", ok: false };
  if (error) return { error: "failed", ok: false };

  revalidateCommissionViews();
  return { error: null, ok: true };
}

export async function updateCommissionStatusAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireArtist())) return { error: "unauthorized", ok: false };

  const id = String(formData.get("id") ?? "");
  const status = parseStatus(formData.get("status"));
  if (!id || !status) return { error: "invalid", ok: false };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("commissions")
    .update({
      status,
      // Marca a conclusão só quando sai de produção pela primeira vez.
      completed_at: status === "done" || status === "delivered" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (isLimitError(error)) return { error: "limit_reached", ok: false };
  if (error) return { error: "failed", ok: false };

  revalidateCommissionViews();
  return { error: null, ok: true };
}

export async function deleteCommissionAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireArtist())) return { error: "unauthorized", ok: false };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "invalid", ok: false };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("commissions").delete().eq("id", id);

  if (error) return { error: "failed", ok: false };

  revalidateCommissionViews();
  return { error: null, ok: true };
}

export async function updateSlotSettingsAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireArtist())) return { error: "unauthorized", ok: false };

  const maxSlots = parseIntField(formData.get("maxSlots"), -1);
  if (maxSlots < 0) return { error: "invalid", ok: false };

  const rawMode = String(formData.get("mode") ?? "");
  const mode: CommissionsMode =
    rawMode === "forced_open" || rawMode === "forced_closed" ? rawMode : "auto";

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ max_slots: maxSlots, commissions_mode: mode, updated_at: new Date().toISOString() })
    .eq("id", true);

  if (error) return { error: "failed", ok: false };

  revalidateCommissionViews();
  return { error: null, ok: true };
}

/** A página pública de comissões precisa refletir a mudança na hora. */
function revalidateCommissionViews(): void {
  revalidatePath("/painel");
  revalidatePath("/painel/comissoes");
  revalidatePath("/comissoes");
}
