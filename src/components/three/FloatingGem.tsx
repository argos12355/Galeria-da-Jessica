"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export function FloatingGem() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.22;
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.25;
  });

  return (
    <mesh ref={meshRef} position={[2.4, 0, -1]} scale={1.3}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
    </mesh>
  );
}
