"use client";
import dynamic from "next/dynamic";

const PalletScene = dynamic(() => import("./PalletScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full grid place-items-center text-muted text-sm">Loading 3D...</div>,
});

export default function PalletSceneLoader() { return <PalletScene />; }
