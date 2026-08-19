import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getArtistSession } from "./auth";
import type { ClientPlatform, Commission, CommissionStatus } from "@/types/commission";

interface CommissionRow {
  id: string;
  client_name: string;
  client_handle: string;
  client_platform: ClientPlatform;
  tier_id: string | null;
  brief: string;
  status: CommissionStatus;
  slots_cost: number;
  is_nsfw: boolean;
  price_cents: number | null;
  paid: boolean;
  notes: string;
  position: number;
  deadline: string | null;
  created_at: string;
  completed_at: string | null;
}

/**
 * Leitura do painel. Sem sessão devolve lista vazia — o RLS já bloquearia,
 * mas checar aqui evita disparar a query à toa.
 */
export async function getCommissions(): Promise<Commission[]> {
  const session = await getArtistSession();
  if (!session) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("commissions")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<CommissionRow[]>();

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    clientName: row.client_name,
    clientHandle: row.client_handle,
    clientPlatform: row.client_platform,
    tierId: row.tier_id,
    brief: row.brief,
    status: row.status,
    slotsCost: row.slots_cost,
    isNsfw: row.is_nsfw,
    priceCents: row.price_cents,
    paid: row.paid,
    notes: row.notes,
    position: row.position,
    deadline: row.deadline,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  }));
}
