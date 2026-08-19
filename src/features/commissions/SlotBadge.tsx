"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/I18nProvider";
import { formatSlotLabel } from "@/lib/commissions/slotLabel";
import { cn } from "@/lib/utils";
import type { SlotState, SlotStatus } from "@/types/commission";

const TONE: Record<SlotStatus, string> = {
  open: "bg-emerald-500/15 text-emerald-300",
  full: "bg-amber-500/15 text-amber-300",
  closed: "bg-white/10 text-muted-foreground",
};

const DOT: Record<SlotStatus, string> = {
  open: "bg-emerald-400",
  full: "bg-amber-400",
  closed: "bg-muted-foreground",
};

export function SlotBadge({ slots, className }: { slots: SlotState; className?: string }) {
  const { dict } = useI18n();

  return (
    <Badge className={cn("h-7 gap-2 border-none px-3 text-sm", TONE[slots.status], className)}>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT[slots.status])} aria-hidden />
      {formatSlotLabel(slots, dict)}
    </Badge>
  );
}
