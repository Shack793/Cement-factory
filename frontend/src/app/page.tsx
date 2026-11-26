"use client";
import { motion } from "framer-motion";
import PlantSceneLoader from "@/components/PlantSceneLoader";
import StatCard from "@/components/StatCard";
import FlowStrip from "@/components/FlowStrip";
import ApiStatus from "@/components/ApiStatus";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-glow">Cement Operations System</div>
          <h1 className="text-3xl md:text-4xl font-semibold glow-text">Plant command centre</h1>
          <p className="text-muted mt-1 max-w-xl text-sm">
            Raw yard, silos, finished goods and every truck in and out, in one live view. Demo figures until the data milestones land.
          </p>
        </div>
        <ApiStatus />
      </motion.header>

      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass relative h-[420px] overflow-hidden"
      >
        <PlantSceneLoader />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-line bg-panel/70 px-3 py-1 text-xs text-muted">
          Drag to rotate, scroll to zoom. The truck loops through the weighbridge and loading bay.
        </div>
      </motion.section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Produced today" value={420} unit="MT" hint="42.5R and 32.5R" delay={0.05} />
        <StatCard label="Bags dispatched" value={8600} unit="bags" hint="Net weight checked" delay={0.15} accent="#f5b942" />
        <StatCard label="Trucks in plant" value={7} unit="trucks" hint="2 at weighbridge" delay={0.25} accent="#3ddc97" />
        <StatCard label="Clinker cover" value={9} unit="days" hint="Reorder at 5 days" delay={0.35} accent="#ff6b6b" />
      </section>

      <FlowStrip />
    </div>
  );
}
