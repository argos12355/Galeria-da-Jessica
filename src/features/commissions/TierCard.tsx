"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { localizedList, localizedText } from "@/i18n/localized";
import { formatPrice } from "@/lib/commissions/price";
import type { CommissionTier } from "@/types/commission";

export function TierCard({ tier }: { tier: CommissionTier }) {
  const { dict, locale } = useI18n();
  const includes = localizedList(tier.includes, locale);

  return (
    <article className="glass flex flex-col overflow-hidden rounded-2xl">
      {tier.sampleImageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={tier.sampleImageUrl}
            alt={localizedText(tier.name, locale)}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {tier.allowsNsfw && (
            <Badge className="absolute right-3 top-3 border-none bg-black/60 text-white">
              {dict.nsfw.badge}
            </Badge>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-medium">{localizedText(tier.name, locale)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {localizedText(tier.description, locale)}
          </p>
        </div>

        <div>
          <span className="text-xs text-muted-foreground">{dict.commissions.priceFrom}</span>
          <p className="text-gradient-aurora text-2xl font-semibold">
            {formatPrice(tier.priceCents, tier.currency, locale)}
          </p>
        </div>

        {includes.length > 0 && (
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {dict.commissions.includes}
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--neon-cyan)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2 text-xs text-muted-foreground">
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
        </div>
      </div>
    </article>
  );
}
