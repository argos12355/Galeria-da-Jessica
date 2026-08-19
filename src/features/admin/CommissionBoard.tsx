"use client";

import { CommissionCard } from "@/features/admin/CommissionCard";
import { NewCommissionForm } from "@/features/admin/NewCommissionForm";
import { SlotBadge } from "@/features/commissions/SlotBadge";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { ACTIVE_STATUSES, CLOSED_STATUSES, isActiveStatus } from "@/types/commission";
import type { Commission, CommissionTier, SlotState } from "@/types/commission";

export function CommissionBoard({
  commissions,
  tiers,
  slots,
}: {
  commissions: Commission[];
  tiers: CommissionTier[];
  slots: SlotState;
}) {
  const { dict } = useI18n();
  const finished = commissions.filter((c) => !isActiveStatus(c.status));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="text-gradient-aurora">{dict.panel.board.title}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{dict.panel.board.subtitle}</p>
          <div className="mt-3 flex items-center gap-3">
            <SlotBadge slots={slots} />
            <span className="text-xs text-muted-foreground">
              {format(dict.panel.board.totalActive, {
                used: slots.usedSlots,
                max: slots.maxSlots,
              })}
            </span>
          </div>
        </div>
      </header>

      <NewCommissionForm tiers={tiers} />

      {/* Uma coluna por etapa de produção. Concluídas saem do quadro para o
          quadro não crescer para sempre. */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ACTIVE_STATUSES.map((status) => {
          const column = commissions.filter((c) => c.status === status);

          return (
            <section key={status} className="rounded-2xl bg-white/[0.03] p-3">
              <h2 className="flex items-center justify-between px-1 pb-3 text-sm font-medium">
                {dict.commissions.status[status]}
                <span className="text-xs text-muted-foreground">{column.length}</span>
              </h2>

              <div className="space-y-3">
                {column.length === 0 ? (
                  <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                    {dict.panel.board.empty}
                  </p>
                ) : (
                  column.map((commission) => (
                    <CommissionCard key={commission.id} commission={commission} />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {finished.length > 0 && (
        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {CLOSED_STATUSES.map((status) => dict.commissions.status[status]).join(" · ")}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {finished.map((commission) => (
              <CommissionCard key={commission.id} commission={commission} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
