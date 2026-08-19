import { isActiveStatus } from "@/types/commission";
import type { Commission, CommissionsMode, SlotState, SlotStatus } from "@/types/commission";

export interface SlotInput {
  maxSlots: number;
  usedSlots: number;
  mode: CommissionsMode;
}

/** Soma o peso das comissões que ainda estão em produção. */
export function countUsedSlots(commissions: Pick<Commission, "status" | "slotsCost">[]): number {
  return commissions.reduce(
    (total, commission) =>
      isActiveStatus(commission.status) ? total + normalizeCost(commission.slotsCost) : total,
    0,
  );
}

/**
 * Estado público das vagas. Roda igual no servidor e no cliente para que o
 * badge da galeria e o botão de comissão nunca discordem entre si.
 */
export function computeSlotState({ maxSlots, usedSlots, mode }: SlotInput): SlotState {
  const max = clampInt(maxSlots);
  // Pode passar do limite se a artista reduzir max_slots com trabalhos em andamento.
  const used = clampInt(usedSlots);
  const available = Math.max(0, max - used);

  const status = resolveStatus({ mode, max, available });

  return {
    status,
    maxSlots: max,
    usedSlots: used,
    availableSlots: available,
    canRequest: status === "open",
  };
}

function resolveStatus({
  mode,
  max,
  available,
}: {
  mode: CommissionsMode;
  max: number;
  available: number;
}): SlotStatus {
  if (mode === "forced_closed") return "closed";
  if (mode === "forced_open") return "open";
  return max === 0 || available === 0 ? "full" : "open";
}

/**
 * Guarda de escrita no painel: impede criar/reativar uma comissão acima do
 * limite. O trigger no banco cobre o mesmo caso — este erro existe só para
 * devolver uma mensagem legível antes da ida ao Postgres.
 */
export function assertSlotAvailable(state: SlotState, slotsCost = 1): void {
  const cost = normalizeCost(slotsCost);
  if (state.usedSlots + cost > state.maxSlots) {
    throw new SlotLimitError(state, cost);
  }
}

export class SlotLimitError extends Error {
  constructor(
    readonly state: SlotState,
    readonly requestedCost: number,
  ) {
    super(
      `Limite de comissões atingido: ${state.usedSlots}/${state.maxSlots} vagas em uso, ` +
        `pedido exige ${requestedCost}.`,
    );
    this.name = "SlotLimitError";
  }
}

function normalizeCost(cost: number): number {
  return Number.isFinite(cost) ? Math.max(1, Math.trunc(cost)) : 1;
}

function clampInt(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}
