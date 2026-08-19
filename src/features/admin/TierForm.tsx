"use client";

import { useActionState, useEffect } from "react";

import { errorText } from "@/features/admin/errorText";
import { useI18n } from "@/i18n/I18nProvider";
import { IDLE } from "@/server/actionState";
import { createTierAction, updateTierAction } from "@/server/tierActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommissionTier } from "@/types/commission";

/**
 * Mesmo formulário serve para criar e editar: a diferença é a action e o
 * campo escondido com o id.
 */
export function TierForm({
  tier,
  onDone,
}: {
  tier?: CommissionTier;
  onDone: () => void;
}) {
  const { dict } = useI18n();
  const editing = Boolean(tier);
  const [state, formAction, pending] = useActionState(
    editing ? updateTierAction : createTierAction,
    IDLE,
  );
  const message = errorText(state.error, dict);

  useEffect(() => {
    if (state.ok) onDone();
  }, [state.ok, onDone]);

  const t = dict.panel.tiers;

  return (
    <form action={formAction} className="glass rounded-2xl p-6">
      {tier && <input type="hidden" name="id" value={tier.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`namePt-${tier?.id ?? "novo"}`}>{t.name} (PT)</Label>
          <Input
            id={`namePt-${tier?.id ?? "novo"}`}
            name="namePt"
            required
            defaultValue={tier?.name.pt ?? ""}
            className="border-white/10 bg-white/5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`nameEn-${tier?.id ?? "novo"}`}>{t.name} (EN)</Label>
          <Input
            id={`nameEn-${tier?.id ?? "novo"}`}
            name="nameEn"
            defaultValue={tier?.name.en ?? ""}
            className="border-white/10 bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`descriptionPt-${tier?.id ?? "novo"}`}>{t.description} (PT)</Label>
          <Textarea
            id={`descriptionPt-${tier?.id ?? "novo"}`}
            name="descriptionPt"
            rows={2}
            defaultValue={tier?.description.pt ?? ""}
            className="border-white/10 bg-white/5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`descriptionEn-${tier?.id ?? "novo"}`}>{t.description} (EN)</Label>
          <Textarea
            id={`descriptionEn-${tier?.id ?? "novo"}`}
            name="descriptionEn"
            rows={2}
            defaultValue={tier?.description.en ?? ""}
            className="border-white/10 bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`includesPt-${tier?.id ?? "novo"}`}>{t.includes} (PT)</Label>
          <Textarea
            id={`includesPt-${tier?.id ?? "novo"}`}
            name="includesPt"
            rows={4}
            defaultValue={(tier?.includes.pt ?? []).join("\n")}
            className="border-white/10 bg-white/5"
          />
          <p className="text-xs text-muted-foreground">{t.includesHint}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`includesEn-${tier?.id ?? "novo"}`}>{t.includes} (EN)</Label>
          <Textarea
            id={`includesEn-${tier?.id ?? "novo"}`}
            name="includesEn"
            rows={4}
            defaultValue={(tier?.includes.en ?? []).join("\n")}
            className="border-white/10 bg-white/5"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor={`price-${tier?.id ?? "novo"}`}>{t.price}</Label>
          <Input
            id={`price-${tier?.id ?? "novo"}`}
            name="price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={tier ? (tier.priceCents / 100).toFixed(2) : ""}
            className="border-white/10 bg-white/5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`deliveryDays-${tier?.id ?? "novo"}`}>{t.deliveryDays}</Label>
          <Input
            id={`deliveryDays-${tier?.id ?? "novo"}`}
            name="deliveryDays"
            type="number"
            min={1}
            defaultValue={tier?.deliveryDays ?? ""}
            className="border-white/10 bg-white/5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`slotsCost-${tier?.id ?? "novo"}`}>{t.slotsCost}</Label>
          <Input
            id={`slotsCost-${tier?.id ?? "novo"}`}
            name="slotsCost"
            type="number"
            min={1}
            defaultValue={tier?.slotsCost ?? 1}
            className="border-white/10 bg-white/5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`sortOrder-${tier?.id ?? "novo"}`}>{t.sortOrder}</Label>
          <Input
            id={`sortOrder-${tier?.id ?? "novo"}`}
            name="sortOrder"
            type="number"
            defaultValue={tier?.sortOrder ?? 0}
            className="border-white/10 bg-white/5"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={tier?.isActive ?? true}
            className="h-4 w-4 accent-[var(--neon-violet)]"
          />
          {t.isActive}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="allowsNsfw"
            defaultChecked={tier?.allowsNsfw ?? false}
            className="h-4 w-4 accent-[var(--neon-violet)]"
          />
          {t.allowsNsfw}
        </label>
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
        <Button type="button" variant="ghost" className="rounded-full" onClick={onDone}>
          {dict.panel.board.cancel}
        </Button>
      </div>
    </form>
  );
}
