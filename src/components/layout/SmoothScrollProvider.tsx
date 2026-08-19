"use client";

import { MotionConfig } from "framer-motion";

import { useLenis } from "@/hooks/useLenis";

/**
 * Camada de movimento do site. `reducedMotion="user"` faz TODA animação de
 * framer-motion (ScrollReveal, tilt dos cards) seguir a preferência do
 * sistema — sem isso o framer-motion ignora `prefers-reduced-motion`.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useLenis();

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
