"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";

export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);

  function onMouseMove(event: MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0, 0, 0)";
  }

  return { ref, onMouseMove, onMouseLeave };
}
