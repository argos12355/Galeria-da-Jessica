"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LOCALES } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

export function LocaleSwitcher() {
  const { locale, dict, setLocale } = useI18n();
  const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length];

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 rounded-full"
      onClick={() => setLocale(next)}
      aria-label={`${dict.locale.switchLabel}: ${dict.locale[next]}`}
      title={dict.locale[next]}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium uppercase">{locale}</span>
    </Button>
  );
}
