"use client";

import { MotionConfig } from "framer-motion";

/**
 * `reducedMotion="user"` faz toda animação de framer-motion seguir a
 * preferência do sistema — sem isso o framer-motion a ignora.
 *
 * Antes este componente também ligava a rolagem suave do Lenis. Removida:
 * sequestrava o scroll nativo e custava 502 KB.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
