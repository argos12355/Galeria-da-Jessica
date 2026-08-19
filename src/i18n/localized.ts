import { DEFAULT_LOCALE, LOCALES } from "./config";
import type { Locale } from "./config";

/** Formato das colunas jsonb traduzíveis: {"pt": "...", "en": "..."}. */
export type Localized<T = string> = Partial<Record<Locale, T>>;

function isFilled<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Cadeia de fallback: idioma pedido → idioma padrão → qualquer um preenchido.
 * Obra sem tradução aparece em português, nunca em branco.
 */
export function localized<T>(field: Localized<T> | null | undefined, locale: Locale): T | undefined {
  if (!field) return undefined;
  if (isFilled(field[locale])) return field[locale];
  if (isFilled(field[DEFAULT_LOCALE])) return field[DEFAULT_LOCALE];
  return LOCALES.map((candidate) => field[candidate]).find(isFilled);
}

export function localizedText(field: Localized | null | undefined, locale: Locale): string {
  return localized(field, locale) ?? "";
}

export function localizedList(
  field: Localized<string[]> | null | undefined,
  locale: Locale,
): string[] {
  return localized(field, locale) ?? [];
}
