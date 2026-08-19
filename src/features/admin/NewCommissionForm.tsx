"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { errorText } from "@/features/admin/errorText";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedText } from "@/i18n/localized";
import { IDLE } from "@/server/actionState";
import { createCommissionAction } from "@/server/adminActions";
import { ACTIVE_STATUSES } from "@/types/commission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommissionTier } from "@/types/commission";

const FIELD =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground";

export function NewCommissionForm({ tiers }: { tiers: CommissionTier[] }) {
  const { dict, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(createCommissionAction, IDLE);
  const message = errorText(state.error, dict);

  useEffect(() => {
    // Só limpa e fecha quando o servidor confirmou a gravação.
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state.ok]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2 rounded-full">
        <Plus className="h-4 w-4" />
        {dict.panel.board.newCommission}
      </Button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="glass w-full rounded-2xl p-6">
      <h2 className="text-lg font-medium">{dict.panel.board.newCommission}</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">{dict.panel.board.clientName}</Label>
          <Input
            id="clientName"
            name="clientName"
            required
            className="border-white/10 bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientHandle">{dict.panel.board.clientHandle}</Label>
          <Input id="clientHandle" name="clientHandle" className="border-white/10 bg-white/5" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">{dict.panel.board.platform}</Label>
          <select id="platform" name="platform" defaultValue="discord" className={FIELD}>
            <option value="discord">{dict.commissions.dialog.discord}</option>
            <option value="twitter">{dict.commissions.dialog.twitter}</option>
            <option value="other">{dict.panel.board.tierNone}</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tierId">{dict.panel.board.tier}</Label>
          <select id="tierId" name="tierId" defaultValue="" className={FIELD}>
            <option value="">{dict.panel.board.tierNone}</option>
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {localizedText(tier.name, locale)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">{dict.panel.board.status}</Label>
          <select id="status" name="status" defaultValue="queued" className={FIELD}>
            {ACTIVE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {dict.commissions.status[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slotsCost">{dict.panel.board.slotsCost}</Label>
          <Input
            id="slotsCost"
            name="slotsCost"
            type="number"
            min={1}
            defaultValue={1}
            className="border-white/10 bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{dict.panel.board.price}</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            className="border-white/10 bg-white/5"
          />
        </div>

        <div className="flex items-end gap-5 pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="paid" className="h-4 w-4 accent-[var(--neon-violet)]" />
            {dict.panel.board.paid}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isNsfw" className="h-4 w-4 accent-[var(--neon-violet)]" />
            {dict.panel.board.isNsfw}
          </label>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="brief">{dict.panel.board.brief}</Label>
          <Textarea id="brief" name="brief" rows={2} className="border-white/10 bg-white/5" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">{dict.panel.board.notes}</Label>
          <Textarea id="notes" name="notes" rows={2} className="border-white/10 bg-white/5" />
        </div>
      </div>

      {message && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {message}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? dict.panel.board.saving : dict.panel.board.save}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="rounded-full"
          onClick={() => setOpen(false)}
        >
          {dict.panel.board.cancel}
        </Button>
      </div>
    </form>
  );
}
