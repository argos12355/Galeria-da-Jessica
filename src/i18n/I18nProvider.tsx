"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { DEFAULT_LOCALE, DICTIONARIES, HTML_LANG, LOCALE_COOKIE } from "./config";
import type { Dictionary, Locale } from "./config";

interface I18nValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Os dois dicionários vão no bundle (são pequenos), então trocar de idioma é
 * instantâneo — sem ida ao servidor e sem recarregar a página.
 */
export function I18nProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    // Um ano: a escolha sobrevive à próxima visita.
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    // O <html lang> vem do servidor; sem isso o leitor de tela continua em pt.
    document.documentElement.lang = HTML_LANG[next];
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ locale, dict: DICTIONARIES[locale], setLocale }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n precisa ser usado dentro de <I18nProvider>.");
  }
  return value;
}
