"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export function GsapTextReveal({
  children,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  as?: "div" | "h1" | "p";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
