import { format } from "@/i18n/format";
import type { Dictionary } from "@/i18n/config";
import type { SlotState } from "@/types/commission";

/**
 * `computeSlotState` decide o estado; aqui só vira texto. Separar os dois
 * mantém a regra de vagas testável sem depender de idioma.
 */
export function formatSlotLabel(state: SlotState, dict: Dictionary): string {
  const slots = dict.commissions.slots;

  if (state.status === "closed") return slots.closed;
  if (state.status === "full") return slots.full;
  // `forced_open` pode estar aberto sem contagem confiável para exibir.
  if (state.maxSlots === 0 || state.availableSlots === 0) return slots.openNoCount;

  return format(slots.open, { available: state.availableSlots, max: state.maxSlots });
}
