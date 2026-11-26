"use client";
import { motion } from "framer-motion";
import { Container, Factory, Package, ShieldAlert, Warehouse, Boxes } from "lucide-react";
import type { Store, StoreType } from "@/lib/types";

const ICONS: Record<StoreType, typeof Warehouse> = {
  RAW_YARD: Boxes, PACKAGING: Package, MANUFACTURING_ROOM: Factory, SILO: Container, FINISHED_GOODS: Warehouse, QUARANTINE: ShieldAlert,
};
const COLORS: Record<StoreType, string> = {
  RAW_YARD: "#f5b942", PACKAGING: "#8aa4b6", MANUFACTURING_ROOM: "#b794f6", SILO: "#3ed6ec", FINISHED_GOODS: "#3ddc97", QUARANTINE: "#ff6b6b",
};

export default function StoreCard({ store, index }: { store: Store; index: number }) {
  const Icon = ICONS[store.type];
  const color = COLORS[store.type];
  const pct = store.utilizationPct ?? null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }} className="glass p-4 relative overflow-hidden"
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-30" style={{ background: color }} />
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${color}22`, color }}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight">{store.name}</div>
          <div className="font-mono text-[11px] text-muted">{store.code}{store.assignedItemCode && ` - ${store.assignedItemCode} only`}</div>
        </div>
      </div>

      {pct !== null && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-muted mb-1">
            <span>{(store.usedKg / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} MT used</span>
            <span>{pct}% of {((store.capacityKg ?? 0) / 1000).toLocaleString()} MT</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }} transition={{ duration: 1.1, delay: 0.2 + index * 0.05 }}
              className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 10px ${color}88` }}
            />
          </div>
        </div>
      )}

      <ul className="mt-3 space-y-1">
        {store.lines.length === 0 && <li className="text-xs text-muted">Empty</li>}
        {store.lines.map((l) => (
          <li key={l.itemCode} className="flex justify-between text-xs">
            <span className="text-muted truncate pr-2">{l.itemName}</span>
            <span className="tabular-nums">{l.quantity.toLocaleString()} {l.unit}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
