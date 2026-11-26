"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const LAYERS = 4, PER_ROW = 5, ROWS = 2;

function Stack() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const bags = useMemo(() => {
    const a: { l: number; x: number; z: number }[] = [];
    for (let l = 0; l < LAYERS; l++)
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < PER_ROW; c++) a.push({ l, x: (c - 2) * 0.6, z: (r - 0.5) * 0.95 });
    return a;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 10;
    bags.forEach((b, i) => {
      const m = refs.current[i];
      if (!m) return;
      const start = b.l * 1.4 + (i % 10) * 0.03;
      const p = Math.min(1, Math.max(0, (t - start) / 0.9));
      const ease = 1 - Math.pow(1 - p, 3);
      m.visible = t > start && t < 9.2;
      m.position.set(b.x, 0.34 + b.l * 0.2 + (1 - ease) * 3, b.z);
    });
  });
  return (
    <group>
      {bags.map((b, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }} castShadow>
          <boxGeometry args={[0.56, 0.18, 0.9]} />
          <meshStandardMaterial color={b.l % 2 ? "#cfe3ea" : "#e9f3f7"} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function PalletScene() {
  return (
    <Canvas shadows camera={{ position: [3.6, 2.6, 4.2], fov: 40 }} dpr={[1, 2]}>
      <color attach="background" args={["#0a1626"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.5} castShadow />
      <pointLight position={[-3, 2, -2]} intensity={8} color="#3ed6ec" />
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.16, 2.1]} />
        <meshStandardMaterial color="#8b6a43" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 0]} receiveShadow>
        <circleGeometry args={[4, 48]} />
        <meshStandardMaterial color="#10243a" />
      </mesh>
      <Stack />
      <Html position={[0, 1.9, 0]} center distanceFactor={8}>
        <div style={{ color: "#3ed6ec", fontSize: 13, background: "rgba(7,16,28,.85)", border: "1px solid rgba(62,214,236,.5)", padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
          1 pallet = 40 bags = 2 MT
        </div>
      </Html>
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.2} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}
