"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SlotSettingsForm } from "@/features/admin/SlotSettingsForm";
import { SlotBadge } from "@/features/commissions/SlotBadge";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import type { CommissionSettings, SlotState } from "@/types/commission";

export function PanelHome({
  slots,
  settings,
}: {
  slots: SlotState;
  settings: CommissionSettings;
}) {
  const { dict } = useI18n();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="text-gradient-aurora">{dict.panel.title}</span>
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <SlotBadge slots={slots} />
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-full"
            nativeButton={false}
            render={<Link href="/painel/comissoes" />}
          >
            {dict.panel.nav.commissions}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <SlotSettingsForm settings={settings} />

      <p className="text-sm text-muted-foreground">{dict.panel.nextSteps}</p>
    </div>
  );
}
