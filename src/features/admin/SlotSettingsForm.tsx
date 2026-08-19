"use client";

import { useActionState } from "react";

import { errorText } from "@/features/admin/errorText";
import { useI18n } from "@/i18n/I18nProvider";
import { IDLE } from "@/server/actionState";
import { updateSlotSettingsAction } from "@/server/adminActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CommissionSettings } from "@/types/commission";

const FIELD =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground";

export function SlotSettingsForm({ settings }: { settings: CommissionSettings }) {
  const { dict } = useI18n();
  const [state, formAction, pending] = useActionState(updateSlotSettingsAction, IDLE);
  const message = errorText(state.error, dict);

  return (
    <form action={formAction} className="glass rounded-2xl p-6">
      <h2 className="text-lg font-medium">{dict.panel.slots.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{dict.panel.slots.hint}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="maxSlots">{dict.panel.slots.maxSlots}</Label>
          <Input
            id="maxSlots"
            name="maxSlots"
            type="number"
            min={0}
            defaultValue={settings.maxSlots}
            className="border-white/10 bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode">{dict.panel.slots.mode}</Label>
          {/* <select> nativo: funciona no teclado sem depender de JavaScript
              e envia junto com o form sem plumbing extra. */}
          <select id="mode" name="mode" defaultValue={settings.mode} className={FIELD}>
            <option value="auto">{dict.panel.slots.modeAuto}</option>
            <option value="forced_open">{dict.panel.slots.modeOpen}</option>
            <option value="forced_closed">{dict.panel.slots.modeClosed}</option>
          </select>
        </div>
      </div>

      {message && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {message}
        </p>
      )}
      {state.ok && !message && (
        <p role="status" className="mt-4 text-sm text-[var(--neon-cyan)]">
          {dict.panel.slots.saved}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-5 rounded-full">
        {pending ? dict.panel.board.saving : dict.panel.slots.save}
      </Button>
    </form>
  );
}
