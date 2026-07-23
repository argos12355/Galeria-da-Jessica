"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    if (!dotRef.current || !ringRef.current) return;
    const dot: HTMLDivElement = dotRef.current;
    const ring: HTMLDivElement = ringRef.current;

    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;

    function onMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    }

    function onOver(event: PointerEvent) {
      const target = event.target as HTMLElement;
      const isInteractive = Boolean(target.closest("a, button, [data-cursor='interactive']"));
      ring.dataset.state = isInteractive ? "hover" : "idle";
    }

    let frame: number;
    function animate() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = requestAnimationFrame(animate);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] hidden md:block" aria-hidden="true">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--neon-cyan)]"
      />
      <div
        ref={ringRef}
        data-state="idle"
        className="fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--neon-violet)]/60 transition-[width,height,opacity] duration-200 ease-out data-[state=hover]:h-12 data-[state=hover]:w-12 data-[state=hover]:border-[var(--neon-cyan)]"
      />
    </div>
  );
}
