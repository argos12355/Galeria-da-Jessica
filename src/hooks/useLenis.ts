"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function useLenis() {
  useEffect(() => {
    // Rolagem suave sequestra o scroll nativo. Quem configurou "menos
    // movimento" no sistema fica com o comportamento padrão do navegador.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // `frame` é reatribuído a cada tick: sem isso o cleanup cancelaria só o
    // primeiro frame e o loop seguiria rodando sobre um Lenis destruído.
    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
