"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";

import { errorText } from "@/features/admin/errorText";
import { useI18n } from "@/i18n/I18nProvider";
import { formatPrice } from "@/lib/commissions/price";
import { IDLE } from "@/server/actionState";
import { deleteCommissionAction, updateCommissionStatusAction } from "@/server/adminActions";
import { ACTIVE_STATUSES, CLOSED_STATUSES } from "@/types/commission";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Commission } from "@/types/commission";

const ALL_STATUSES = [...ACTIVE_STATUSES, ...CLOSED_STATUSES];

export function CommissionCard({ commission }: { commission: Commission }) {
  const { dict, locale } = useI18n();
  const [moveState, moveAction, moving] = useActionState(updateCommissionStatusAction, IDLE);
  const [deleteState, deleteAction, deleting] = useActionState(deleteCommissionAction, IDLE);

  const message = errorText(moveState.error ?? deleteState.error, dict);

  return (
    <article className="glass rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{commission.clientName}</h3>
          {commission.clientHandle && (
            <p className="truncate text-xs text-muted-foreground">
              {commission.clientHandle} · {commission.clientPlatform}
            </p>
          )}
        </div>

        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (!window.confirm(dict.panel.board.confirmDelete)) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={commission.id} />
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            disabled={deleting}
            aria-label={dict.panel.board.delete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {commission.brief && <p className="mt-2 text-sm text-muted-foreground">{commission.brief}</p>}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {commission.priceCents !== null && (
          <Badge variant="outline" className="border-white/15 text-muted-foreground">
            {formatPrice(commission.priceCents, "BRL", locale)}
          </Badge>
        )}
        {commission.paid && (
          <Badge className="border-none bg-emerald-500/15 text-emerald-300">
            {dict.panel.board.paid}
          </Badge>
        )}
        {commission.slotsCost > 1 && (
          <Badge variant="outline" className="border-amber-400/30 text-amber-300">
            {commission.slotsCost} ×
          </Badge>
        )}
        {commission.isNsfw && (
          <Badge className="border-none bg-black/60 text-white">{dict.nsfw.badge}</Badge>
        )}
      </div>

      {commission.notes && (
        <p className="mt-3 whitespace-pre-line rounded-lg bg-white/5 p-2 text-xs text-muted-foreground">
          {commission.notes}
        </p>
      )}

      {/* Trocar de etapa por <select> em vez de arrastar: acessível ao
          teclado e a leitor de tela, sem biblioteca de drag-and-drop. */}
      <form action={moveAction} className="mt-3 flex gap-2">
        <input type="hidden" name="id" value={commission.id} />
        <label htmlFor={`status-${commission.id}`} className="sr-only">
          {dict.panel.board.status}
        </label>
        <select
          id={`status-${commission.id}`}
          name="status"
          defaultValue={commission.status}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs"
        >
          {ALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {dict.commissions.status[status]}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" variant="outline" disabled={moving}>
          {moving ? dict.panel.board.saving : dict.panel.board.save}
        </Button>
      </form>

      {message && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {message}
        </p>
      )}
    </article>
  );
}
