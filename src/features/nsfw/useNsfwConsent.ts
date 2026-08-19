"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "galeria-maior-de-idade";

/**
 * Consentimento +18 por sessão, guardado em sessionStorage.
 *
 * Não vai para o banco de propósito: declaração de idade de visitante é dado
 * sensível que não temos motivo para armazenar. Fechou o navegador, pergunta
 * de novo.
 */
export function useNsfwConsent() {
  const [confirmed, setConfirmed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setConfirmed(window.sessionStorage.getItem(KEY) === "1");
    } catch {
      // Modo privado pode bloquear sessionStorage: segue sem consentimento.
    }
    setHydrated(true);
  }, []);

  const confirm = useCallback(() => {
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      // Sem persistir, o aceite vale só para esta página.
    }
    setConfirmed(true);
  }, []);

  const revoke = useCallback(() => {
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    setConfirmed(false);
  }, []);

  // Antes de hidratar assumimos "não confirmado": o conteúdo nasce coberto.
  return { confirmed: hydrated && confirmed, confirm, revoke, hydrated };
}
