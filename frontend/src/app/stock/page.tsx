"use client";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useList } from "@/lib/useList";
import { SAMPLE_ITEMS, SAMPLE_LOW, SAMPLE_MOVEMENTS, SAMPLE_STORES, SAMPLE_UNITS } from "@/lib/sample";
import type { Item, LowStock, Movement, Store, Unit } from "@/lib/types";
import PlantSceneLoader from "@/components/PlantSceneLoader";
import StoreCard from "@/components/StoreCard";
import StockActions from "@/components/StockActions";
import DataTable from "@/components/DataTable";

const COLORS: Record<string, string> = { "SILO-CLK": "#8b8f94", "SILO-425": "#3ed6ec", "SILO-325": "#f5b942" };

export default function StockPage() {
  const stores = useList<Store>("/api/stores", SAMPLE_STORES);
  const moves = useList<Movement>("/api/stock/movements?limit=30", SAMPLE_MOVEMENTS);
  const low = useList<LowStock>("/api/stock/low", SAMPLE_LOW);
  const items = useList<Item>("/api/items", SAMPLE_ITEMS);
  const units = useList<Unit>("/api/units", SAMPLE_UNITS);
  const live = stores.live;
  const reload = () => { stores.reload(); moves.reload(); low.reload(); };

  const scene = useMemo(() => {
    const silos = stores.data.filter((s) => s.type === "SILO").map((s) => ({
      label: `${s.assignedItemCode === "CLINKER" ? "Clinker" : s.assignedItemCode?.includes("425") ? "42.5R" : "32.5R"} ${Math.round((s.capacityKg ?? 0) / 1000)} MT (${s.utilizationPct ?? 0}%)`,
      level: (s.utilizationPct ?? 0) / 100, color: COLORS[s.code] ?? "#3ed6ec",
    }));
    const yardLines = stores.data.find((s) => s.type === "RAW_YARD")?.lines ?? [];
    const q = (c: string) => yardLines.find((l) => l.itemCode === c)?.quantity ?? 0;
    const bags = (stores.data.find((s) => s.type === "FINISHED_GOODS")?.lines ?? []).reduce((a, l) => a + l.quantity, 0);
    return {
      silos: silos.length === 3 ? silos : undefined,
      yard: { clinker: Math.min(1, q("CLINKER") / 400), gypsum: Math.min(1, q("GYPSUM") / 20), flyash: Math.min(1, q("FLYASH") / 60) },
      fgLabel: `Finished goods: ${bags.toLocaleString()} bags`,
    };
  }, [stores.data]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.25em] text-glow">Milestone 2 - PDF sections 3.1 to 3.4 and 4.2</div>
        <h1 className="text-3xl font-semibold glow-text">Stores and stock</h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">Three stock points, one ledger. Balances are always In minus Out. Silo levels and pile sizes below are drawn from live stock.</p>
        {!live && <div className="mt-3 inline-block rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-xs text-amber">Backend offline: showing demo data. Start Spring Boot to post receipts, transfers and adjustments.</div>}
      </header>

      <div className="glass relative h-[400px] overflow-hidden">
        <PlantSceneLoader {...scene} />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-line bg-panel/70 px-3 py-1 text-xs text-muted">Live stock view: silo fill and pile size follow the ledger</div>
      </div>

      <AnimatePresence>
        {low.data.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-[#ff6b6b]/40 bg-[#ff6b6b]/10 p-4">
              <div className="flex items-center gap-2 text-[#ff6b6b] font-medium text-sm"><AlertTriangle size={16} /> Below reorder level</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {low.data.map((l) => (
                  <div key={l.itemCode} className="rounded-lg bg-black/20 px-3 py-2 text-sm">
                    <div className="font-medium">{l.itemName}</div>
                    <div className="text-xs text-muted">Have {l.quantity.toLocaleString()} {l.unit}. Short by {(l.shortfallKg / 1000).toLocaleString()} MT-equivalent.</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stores.data.map((s, i) => <StoreCard key={s.id} store={s} index={i} />)}
      </section>

      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <StockActions stores={stores.data} items={items.data} units={units.data} live={live} onDone={reload} />
        <div className="min-w-0 space-y-2">
          <div className="text-xs uppercase tracking-widest text-muted">Stock ledger (latest)</div>
          <DataTable<Movement> rows={moves.data} cols={[
            { label: "Store", render: (r) => <span className="font-mono text-glow">{r.storeCode}</span> },
            { label: "Item", render: (r) => r.itemName },
            { label: "Type", render: (r) => <span className="text-xs">{r.type.replace("_", " ")}</span> },
            { label: "Qty", align: "right", render: (r) => <span className={r.quantity < 0 ? "text-[#ff6b6b]" : "text-[#3ddc97]"}>{r.quantity > 0 ? "+" : ""}{r.quantity.toLocaleString()} {r.unit}</span> },
            { label: "Status", render: (r) => <span className={`text-xs ${r.status === "PENDING" ? "text-amber" : r.status === "REJECTED" ? "text-[#ff6b6b]" : "text-muted"}`}>{r.status}</span> },
          ]} />
        </div>
      </section>
    </div>
  );
}
