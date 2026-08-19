"use client";

import Image from "next/image";
import { Check, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedList, localizedText } from "@/i18n/localized";
import { formatPrice } from "@/lib/commissions/price";
import type { CommissionTier } from "@/types/commission";

export function TierCard({ tier }: { tier: CommissionTier }) {
  const { dict, locale } = useI18n();
  const includes = localizedList(tier.includes, locale);
  const name = localizedText(tier.name, locale);

  return (
    <article className="glass group flex h-full flex-col overflow-hidden rounded-3xl ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:ring-[var(--neon-violet)]/40">
      {tier.sampleImageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={tier.sampleImageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          {tier.allowsNsfw && (
            <Badge className="absolute right-3 top-3 border-none bg-black/70 text-white">
              {dict.nsfw.badge}
            </Badge>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {localizedText(tier.description, locale)}
          </p>
        </div>

        {/* O preço é a informação que o visitante veio buscar. */}
        <div className="flex items-baseline gap-2 border-y border-white/10 py-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {dict.commissions.priceFrom}
          </span>
          <span className="text-gradient-aurora text-3xl font-semibold">
            {formatPrice(tier.priceCents, tier.currency, locale)}
          </span>
        </div>

        {includes.length > 0 && (
          <ul className="space-y-2.5 text-sm">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-cyan)]" aria-hidden />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs">
          {tier.deliveryDays && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {format(dict.commissions.deliveryDays, { days: tier.deliveryDays })}
            </span>
          )}
          {tier.slotsCost > 1 && (
            <Badge variant="outline" className="border-amber-400/30 text-amber-300">
              {format(dict.commissions.slotsNote, { count: tier.slotsCost })}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
