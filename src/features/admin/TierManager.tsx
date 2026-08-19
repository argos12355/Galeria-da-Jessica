"use client";

import { useActionState, useCallback, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { errorText } from "@/features/admin/errorText";
import { TierForm } from "@/features/admin/TierForm";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedList, localizedText } from "@/i18n/localized";
import { formatPrice } from "@/lib/commissions/price";
import { IDLE } from "@/server/actionState";
import { deleteTierAction } from "@/server/tierActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CommissionTier } from "@/types/commission";

export function TierManager({ tiers }: { tiers: CommissionTier[] }) {
  const { dict } = useI18n();
  const [creating, setCreating] = useState(false);
  const closeCreate = useCallback(() => setCreating(false), []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="text-gradient-aurora">{dict.panel.tiers.title}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{dict.panel.tiers.subtitle}</p>
      </header>

      {creating ? (
        <TierForm onDone={closeCreate} />
      ) : (
        <Button onClick={() => setCreating(true)} className="gap-2 rounded-full">
          <Plus className="h-4 w-4" />
          {dict.panel.tiers.newTier}
        </Button>
      )}

      {tiers.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {dict.panel.tiers.empty}
        </p>
      ) : (
        <div className="space-y-3">
          {tiers.map((tier) => (
            <TierRow key={tier.id} tier={tier} />
          ))}
        </div>
      )}
    </div>
  );
}

function TierRow({ tier }: { tier: CommissionTier }) {
  const { dict, locale } = useI18n();
  const [editing, setEditing] = useState(false);
  const [state, deleteAction, deleting] = useActionState(deleteTierAction, IDLE);
  const closeEdit = useCallback(() => setEditing(false), []);

  const message = errorText(state.error, dict);
  const includes = localizedList(tier.includes, locale);

  if (editing) return <TierForm tier={tier} onDone={closeEdit} />;

  return (
    <article className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-medium">{localizedText(tier.name, locale)}</h2>
            {!tier.isActive && (
              <Badge className="border-none bg-amber-500/80 text-white">
                {dict.panel.tiers.hidden}
              </Badge>
            )}
            {tier.allowsNsfw && (
              <Badge className="border-none bg-black/60 text-white">{dict.nsfw.badge}</Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {localizedText(tier.description, locale)}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-white/15 text-muted-foreground">
              {formatPrice(tier.priceCents, tier.currency, locale)}
            </Badge>
            {tier.deliveryDays && (
              <Badge variant="outline" className="border-white/15 text-muted-foreground">
                {format(dict.commissions.deliveryDays, { days: tier.deliveryDays })}
              </Badge>
            )}
            {tier.slotsCost > 1 && (
              <Badge variant="outline" className="border-amber-400/30 text-amber-300">
                {format(dict.commissions.slotsNote, { count: tier.slotsCost })}
              </Badge>
            )}
            {includes.length > 0 && (
              <Badge variant="outline" className="border-white/15 text-muted-foreground">
                {includes.length} · {dict.commissions.includes}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-full"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
            {dict.panel.tiers.edit}
          </Button>

          <form
            action={deleteAction}
            onSubmit={(event) => {
              if (!window.confirm(dict.panel.tiers.confirmDelete)) event.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={tier.id} />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={deleting}
              aria-label={dict.panel.board.delete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {message && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {message}
        </p>
      )}
    </article>
  );
}
