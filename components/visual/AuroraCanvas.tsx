"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// A single slowly-drifting, distorting colour blob. Several of these, heavily
// blurred via CSS, read as a premium moving "aurora" gradient behind the UI.
function Blob({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.x = position[0] + Math.sin(t * speed * 0.6) * 0.8;
    ref.current.position.y = position[1] + Math.cos(t * speed * 0.5) * 0.9;
    ref.current.rotation.z = t * 0.08 * speed;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.6}
        metalness={0.1}
        speed={1.8}
        distort={0.5}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

// Gentle camera parallax that follows the pointer for an interactive, alive feel.
function ParallaxRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function AuroraCanvas() {
  // Pause the render loop while the tab is hidden to save CPU/GPU/battery.
  const [running, setRunning] = useState(true);
  useEffect(() => {
    const onVis = () => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      frameloop={running ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <ParallaxRig />
      <Blob position={[-3.2, 1.4, 0]} color="#16E07A" scale={2.6} speed={1} />
      <Blob position={[3.4, -0.6, -1]} color="#0A2540" scale={2.9} speed={0.8} />
      <Blob position={[1.6, 2.2, -2]} color="#34D8FF" scale={2.1} speed={1.2} />
      <Blob position={[-2.4, -2.2, -1]} color="#16E07A" scale={2.3} speed={0.9} />
    </Canvas>
  );
}
