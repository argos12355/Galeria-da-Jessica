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
    <div>
      {/* Cabeçalho centralizado: a decisão do visitante é uma só, então tudo
          converge para o botão. */}
      <section className="aurora-bg noise-overlay relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24">
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
          <ScrollReveal>
            <SlotBadge slots={slots} />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-gradient-aurora">{dict.commissions.title}</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{dict.commissions.subtitle}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-8 flex flex-col items-center">
              <CommissionCTA slots={slots} settings={settings} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <ScrollReveal key={tier.id} delay={index * 0.08} className="h-full">
              <TierCard tier={tier} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
