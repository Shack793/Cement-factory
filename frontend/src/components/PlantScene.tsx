"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Silo({ x, z = 0, color, label, base }: { x: number; z?: number; color: string; label: string; base: number }) {
  const fill = useRef<THREE.Mesh>(null);
  const H = 3.2;
  useFrame(({ clock }) => {
    const level = Math.min(0.98, Math.max(0.08, base + Math.sin(clock.elapsedTime * 0.6 + x) * 0.06));
    if (fill.current) {
      fill.current.scale.y = level;
      fill.current.position.y = (H * level) / 2 + 0.02;
    }
  });
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, H / 2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, H, 40, 1, true]} />
        <meshStandardMaterial color="#9fb6c6" transparent opacity={0.28} side={THREE.DoubleSide} metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh ref={fill} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.74, 0.74, H, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, H + 0.25, 0]} castShadow>
        <coneGeometry args={[0.85, 0.55, 40]} />
        <meshStandardMaterial color="#c9d6df" metalness={0.5} roughness={0.35} />
      </mesh>
      <Html position={[0, H + 0.95, 0]} center distanceFactor={9}>
        <div style={{ color: "#e6f1f6", fontSize: 12, background: "rgba(7,16,28,.8)", border: "1px solid rgba(120,190,210,.3)", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

function Warehouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[4.2, 1.8, 2.6]} />
        <meshStandardMaterial color="#1b9aaf" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.0, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[4.4, 0.18, 2.8]} />
        <meshStandardMaterial color="#16304f" />
      </mesh>
      {[-1.4, 0, 1.4].map((px) => (
        <mesh key={px} position={[px, 0.65, 1.31]}>
          <boxGeometry args={[1, 1.3, 0.05]} />
          <meshStandardMaterial color="#0b1a2b" emissive="#3ed6ec" emissiveIntensity={0.15} />
        </mesh>
      ))}
      <Html position={[0, 2.7, 0]} center distanceFactor={9}>
        <div style={{ color: "#e6f1f6", fontSize: 12, background: "rgba(7,16,28,.8)", border: "1px solid rgba(120,190,210,.3)", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
          Finished goods
        </div>
      </Html>
    </group>
  );
}

function Pile({ x, z, color, s = 1 }: { x: number; z: number; color: string; s?: number }) {
  return (
    <mesh position={[x, 0.45 * s, z]} castShadow>
      <coneGeometry args={[0.7 * s, 0.9 * s, 24]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Truck() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    // 10s loop: approach, pause on the weighbridge (tare), pause at bay, leave
    const t = clock.elapsedTime % 10;
    let x = -7;
    if (t < 3) x = -7 + (t / 3) * 7;            // drive in to the scale (x = 0)
    else if (t < 5) x = 0;                       // weigh in (tare)
    else if (t < 7) x = ((t - 5) / 2) * 3;       // to loading bay (x = 3)
    else if (t < 8.5) x = 3;                     // loading
    else x = 3 + ((t - 8.5) / 1.5) * 5;          // gross + exit
    if (g.current) g.current.position.x = x;
  });
  return (
    <group ref={g} position={[-7, 0.28, 2.4]}>
      <mesh position={[0.9, 0.5, 0]} castShadow><boxGeometry args={[0.7, 0.7, 0.7]} /><meshStandardMaterial color="#f5b942" /></mesh>
      <mesh position={[-0.3, 0.55, 0]} castShadow><boxGeometry args={[1.8, 0.8, 0.75]} /><meshStandardMaterial color="#d8e6ee" /></mesh>
      {[0.9, -0.1, -0.7].map((wx) => [-0.4, 0.4].map((wz) => (
        <mesh key={`${wx}${wz}`} position={[wx, 0.1, wz]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} /><meshStandardMaterial color="#111" />
        </mesh>
      )))}
    </group>
  );
}

function Weighbridge() {
  const pad = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 10;
    const on = t > 3 && t < 5;
    if (pad.current) (pad.current.material as THREE.MeshStandardMaterial).emissiveIntensity = on ? 0.9 : 0.15;
  });
  return (
    <group position={[0, 0, 2.4]}>
      <mesh ref={pad} position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[3, 0.12, 1.3]} />
        <meshStandardMaterial color="#274a69" emissive="#3ed6ec" emissiveIntensity={0.15} />
      </mesh>
      <Html position={[0, 1.4, 0]} center distanceFactor={9}>
        <div style={{ color: "#3ed6ec", fontSize: 12, background: "rgba(7,16,28,.85)", border: "1px solid rgba(62,214,236,.5)", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
          Weighbridge
        </div>
      </Html>
    </group>
  );
}

export default function PlantScene() {
  return (
    <Canvas shadows camera={{ position: [8.5, 6.5, 12], fov: 44 }} dpr={[1, 2]}>
      <color attach="background" args={["#07101c"]} />
      <fog attach="fog" args={["#07101c", 14, 30]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 5]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, 2]} intensity={12} color="#3ed6ec" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0c1c2f" />
      </mesh>
      <gridHelper args={[40, 40, "#1b9aaf", "#12304a"]} position={[0, 0.01, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2.4]}>
        <planeGeometry args={[18, 1.6]} />
        <meshStandardMaterial color="#14283d" />
      </mesh>

      <Silo x={-2.2} z={-1.2} color="#8b8f94" label="Clinker 1,000 MT" base={0.7} />
      <Silo x={0} z={-1.2} color="#3ed6ec" label="42.5R 500 MT" base={0.55} />
      <Silo x={2.2} z={-1.2} color="#f5b942" label="32.5R 500 MT" base={0.4} />
      <Warehouse position={[6.2, 0, -1.2]} />
      <Pile x={-6} z={-1.5} color="#2a2d31" s={1.3} />
      <Pile x={-5} z={-0.6} color="#e8e4d8" s={0.9} />
      <Pile x={-6.4} z={0} color="#9aa3aa" s={0.8} />
      <Html position={[-5.6, 1.9, -1]} center distanceFactor={9}>
        <div style={{ color: "#e6f1f6", fontSize: 12, background: "rgba(7,16,28,.8)", border: "1px solid rgba(120,190,210,.3)", padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
          Raw yard
        </div>
      </Html>

      <Weighbridge />
      <Truck />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.5} scale={30} blur={2.4} far={8} />
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2.15} minDistance={7} maxDistance={18} />
    </Canvas>
  );
}
