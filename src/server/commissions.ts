import { computeSlotState } from "@/lib/commissions/slots";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Localized } from "@/i18n/localized";
import type { CommissionSettings, CommissionTier, SlotState } from "@/types/commission";

/**
 * Leitura pública de comissões. Tudo aqui falha fechado: sem banco, o site
 * mostra "comissões fechadas" e nenhum preço, em vez de dado inventado.
 */

const CLOSED: SlotState = {
  status: "closed",
  maxSlots: 0,
  usedSlots: 0,
  availableSlots: 0,
  canRequest: false,
};

const NO_CONTACT: CommissionSettings = {
  maxSlots: 0,
  mode: "forced_closed",
  rules: {},
  discordUrl: null,
  discordHandle: null,
  twitterUrl: null,
  twitterHandle: null,
};

interface SettingsRow {
  max_slots: number;
  commissions_mode: CommissionSettings["mode"];
  commission_rules: Localized<string[]> | null;
  discord_url: string | null;
  discord_handle: string | null;
  twitter_url: string | null;
  twitter_handle: string | null;
}

interface TierRow {
  id: string;
  name: Localized;
  description: Localized;
  includes: Localized<string[]> | null;
  price_cents: number;
  currency: string;
  delivery_days: number | null;
  slots_cost: number;
  allows_nsfw: boolean;
  sample_image_path: string | null;
  sort_order: number;
}

export async function getCommissionSettings(): Promise<CommissionSettings> {
  if (!isSupabaseConfigured()) return NO_CONTACT;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "max_slots, commissions_mode, commission_rules, discord_url, discord_handle, twitter_url, twitter_handle",
    )
    .eq("id", true)
    .single<SettingsRow>();

  if (error || !data) return NO_CONTACT;

  return {
    maxSlots: data.max_slots,
    mode: data.commissions_mode,
    rules: data.commission_rules ?? {},
    discordUrl: data.discord_url,
    discordHandle: data.discord_handle,
    twitterUrl: data.twitter_url,
    twitterHandle: data.twitter_handle,
  };
}

export async function getCommissionTiers(): Promise<CommissionTier[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  // A policy de RLS já filtra is_active — não precisa repetir no where.
  const { data, error } = await supabase
    .from("commission_tiers")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<TierRow[]>();

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    includes: row.includes ?? {},
    priceCents: row.price_cents,
    currency: row.currency,
    deliveryDays: row.delivery_days,
    slotsCost: row.slots_cost,
    allowsNsfw: row.allows_nsfw,
    // O caminho vira URL pública do Storage; sem imagem, o card só não mostra capa.
    sampleImageUrl: row.sample_image_path
      ? supabase.storage.from("artworks").getPublicUrl(row.sample_image_path).data.publicUrl
      : null,
    isActive: true,
    sortOrder: row.sort_order,
  }));
}

export async function getSlotState(): Promise<SlotState> {
  if (!isSupabaseConfigured()) return CLOSED;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .rpc("public_slot_status")
    .single<{ max_slots: number; used_slots: number; mode: CommissionSettings["mode"] }>();

  // Sem certeza de vaga, não convidamos o cliente a pedir.
  if (error || !data) return CLOSED;

  return computeSlotState({
    maxSlots: data.max_slots,
    usedSlots: data.used_slots,
    mode: data.mode,
  });
}
