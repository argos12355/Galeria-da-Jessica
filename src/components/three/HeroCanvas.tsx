"use client";

import { Canvas } from "@react-three/fiber";

import { FloatingGem } from "./FloatingGem";
import { ParticleField } from "./ParticleField";

export function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ParticleField />
      <FloatingGem />
    </Canvas>
  );
}
