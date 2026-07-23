"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("./HeroCanvas").then((mod) => mod.HeroCanvas), {
  ssr: false,
});

export function HeroCanvasClient() {
  return <HeroCanvas />;
}
