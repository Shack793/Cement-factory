"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Health = { status: string; service: string; version: string };

export default function ApiStatus() {
  const [state, setState] = useState<"checking" | "up" | "down">("checking");
  const [info, setInfo] = useState<Health | null>(null);
  useEffect(() => {
    api<Health>("/api/health").then((h) => { setInfo(h); setState("up"); }).catch(() => setState("down"));
  }, []);
  const color = state === "up" ? "bg-[#3ddc97] pulse-ok" : state === "down" ? "bg-[#ff6b6b]" : "bg-amber";
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-3 py-1 text-xs">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {state === "up" && `Backend online v${info?.version}`}
      {state === "down" && "Backend offline (start Spring Boot on :8080)"}
      {state === "checking" && "Checking backend..."}
    </div>
  );
}
