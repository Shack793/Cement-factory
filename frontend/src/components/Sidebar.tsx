"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MODULES, COMPLETED_MILESTONES } from "@/lib/modules";

export default function Sidebar() {
  const path = usePathname();
  const groups = Array.from(new Set(MODULES.map((m) => m.group)));
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col gap-6 p-5 border-r border-line bg-[#081424]/80 backdrop-blur sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal to-glow grid place-items-center font-bold text-[#04121f] shadow-[0_0_24px_rgba(62,214,236,.5)]"
        >
          C
        </motion.div>
        <div>
          <div className="font-semibold leading-tight">Cement Factory</div>
          <div className="text-xs text-muted">Operations System</div>
        </div>
      </div>
      {groups.map((g) => (
        <div key={g}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-2">{g}</div>
          <nav className="flex flex-col gap-1">
            {MODULES.filter((m) => m.group === g).map((m) => {
              const done = COMPLETED_MILESTONES.includes(m.milestone);
              const active = path === m.href;
              return (
                <Link key={m.href} href={m.href} className="relative">
                  {active && (
                    <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg bg-teal/20 border border-teal/40" />
                  )}
                  <span className={`relative flex items-center justify-between px-3 py-2 rounded-lg text-sm ${active ? "text-white" : "text-muted hover:text-white"}`}>
                    {m.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${done ? "bg-[#3ddc97]/15 text-[#3ddc97]" : "bg-white/5 text-muted"}`}>
                      {done ? "live" : `M${m.milestone}`}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </aside>
  );
}
