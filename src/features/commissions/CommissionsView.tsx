"use client";

import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { CommissionCTA } from "@/features/commissions/CommissionCTA";
import { SlotBadge } from "@/features/commissions/SlotBadge";
import { TierCard } from "@/features/commissions/TierCard";
import { useI18n } from "@/i18n/I18nProvider";
import type { CommissionSettings, CommissionTier, SlotState } from "@/types/commission";

export function CommissionsView({
  slots,
  settings,
  tiers,
}: {
  slots: SlotState;
  settings: CommissionSettings;
  tiers: CommissionTier[];
}) {
  const { dict } = useI18n();

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <SlotBadge slots={slots} />
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="text-gradient-aurora">{dict.commissions.title}</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">{dict.commissions.subtitle}</p>

        <div className="mt-8">
          <CommissionCTA slots={slots} settings={settings} />
        </div>
      </ScrollReveal>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>
    </div>
  );
}
