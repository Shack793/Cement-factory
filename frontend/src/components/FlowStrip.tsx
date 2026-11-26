"use client";
import { motion } from "framer-motion";

const NODES = [
  { t: "Raw Material Yard", s: "Clinker, gypsum, fly ash", u: "tonnes" },
  { t: "Silo Area", s: "42.5R, 32.5R, clinker", u: "tonnes" },
  { t: "Finished Goods", s: "Bags on pallets", u: "bags" },
  { t: "Dispatch", s: "Weighed, ticketed, gated", u: "trucks" },
];
const LABELS = ["Grinding run", "Bagging run", "Weigh out"];

export default function FlowStrip() {
  return (
    <div className="glass p-5">
      <div className="text-xs uppercase tracking-widest text-muted mb-4">Plant flow (PDF section 3)</div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-3">
        {NODES.map((n, i) => (
          <div key={n.t} className="contents">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-teal/40 bg-teal/10 p-3 text-center"
            >
              <div className="text-sm font-semibold">{n.t}</div>
              <div className="text-[11px] text-muted">{n.s}</div>
              <div className="mt-1 text-[10px] text-glow uppercase tracking-wider">{n.u}</div>
            </motion.div>
            {i < NODES.length - 1 && (
              <div className="flex flex-col items-center min-w-[84px]">
                <span className="text-[10px] text-muted mb-1">{LABELS[i]}</span>
                <svg width="84" height="12" viewBox="0 0 84 12">
                  <line x1="0" y1="6" x2="76" y2="6" stroke="#3ed6ec" strokeWidth="2" className="flow-line" />
                  <polygon points="76,1 84,6 76,11" fill="#3ed6ec" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
