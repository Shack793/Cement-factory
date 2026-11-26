"use client";
import dynamic from "next/dynamic";

const PlantScene = dynamic(() => import("./PlantScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full grid place-items-center text-muted text-sm">Loading 3D plant...</div>,
});

export default function PlantSceneLoader() {
  return <PlantScene />;
}
