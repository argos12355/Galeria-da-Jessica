import type { Localized } from "@/i18n/localized";

/** Status que ocupam vaga. A ordem define as colunas do kanban. */
export const ACTIVE_STATUSES = ["queued", "sketch", "lineart", "coloring"] as const;
export const CLOSED_STATUSES = ["done", "delivered", "cancelled"] as const;

export type ActiveStatus = (typeof ACTIVE_STATUSES)[number];
export type ClosedStatus = (typeof CLOSED_STATUSES)[number];
export type CommissionStatus = ActiveStatus | ClosedStatus;

/** Rótulos ficam em `dict.commissions.status` — aqui só existem chaves. */
export function isActiveStatus(status: CommissionStatus): status is ActiveStatus {
  return (ACTIVE_STATUSES as readonly string[]).includes(status);
}

export type ClientPlatform = "discord" | "twitter" | "other";

export interface Commission {
  id: string;
  clientName: string;
  clientHandle: string;
  clientPlatform: ClientPlatform;
  tierId: string | null;
  brief: string;
  status: CommissionStatus;
  slotsCost: number;
  isNsfw: boolean;
  priceCents: number | null;
  paid: boolean;
  notes: string;
  position: number;
  deadline: string | null;
  createdAt: string;
  completedAt: string | null;
}

/** Tabela de preços é conteúdo público, então nome/descrição são traduzíveis. */
export interface CommissionTier {
  id: string;
  name: Localized;
  description: Localized;
  priceCents: number;
  currency: string;
  deliveryDays: number | null;
  includes: Localized<string[]>;
  slotsCost: number;
  allowsNsfw: boolean;
  sampleImageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

/** Recorte público de site_settings — o que o pop-up de contato precisa. */
export interface CommissionSettings {
  maxSlots: number;
  mode: CommissionsMode;
  rules: Localized<string[]>;
  discordUrl: string | null;
  discordHandle: string | null;
  twitterUrl: string | null;
  twitterHandle: string | null;
}

/**
 * `auto` deriva o status das vagas ocupadas.
 * `forced_open` aceita pedidos mesmo lotado (fila de espera).
 * `forced_closed` fecha independente das vagas (férias, pausa).
 */
export type CommissionsMode = "auto" | "forced_open" | "forced_closed";

export type SlotStatus = "open" | "full" | "closed";

export interface SlotState {
  status: SlotStatus;
  maxSlots: number;
  usedSlots: number;
  availableSlots: number;
  /** Única fonte de verdade para habilitar o botão/pop-up no frontend. */
  canRequest: boolean;
}
