import { HTML_LANG } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

/** Preço é guardado em centavos para não acumular erro de ponto flutuante. */
export function formatPrice(priceCents: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(HTML_LANG[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);
}
