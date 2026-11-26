"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { Item, Store, Unit } from "@/lib/types";

const MODES = ["Receive", "Issue", "Transfer", "Adjust"] as const;
type Mode = (typeof MODES)[number];
const REASONS = ["COUNT_DIFF", "DAMAGE", "SPILLAGE", "WET_CAKED", "BURST_BAGS", "OTHER"];
const sel = "rounded-md bg-[#0a1626] border border-line px-2 py-2 text-sm text-white w-full";

export default function StockActions({ stores, items, units, live, onDone }: { stores: Store[]; items: Item[]; units: Unit[]; live: boolean; onDone: () => void }) {
  const [mode, setMode] = useState<Mode>("Receive");
  const [v, setV] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: string, val: string) => setV((o) => ({ ...o, [k]: val }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const num = (k: string) => (v[k] ? Number(v[k]) : undefined);
    let path = "", body: Record<string, unknown> = {};
    if (mode === "Receive" || mode === "Issue") {
      path = mode === "Receive" ? "/api/stock/receipts" : "/api/stock/issues";
      body = { storeId: num("storeId"), itemId: num("itemId"), quantity: num("quantity"), unit: v.unit || undefined, lotCode: v.lotCode || undefined, reference: v.reference || undefined };
    } else if (mode === "Transfer") {
      path = "/api/stock/transfers";
      body = { fromStoreId: num("fromStoreId"), toStoreId: num("toStoreId"), itemId: num("itemId"), quantity: num("quantity"), unit: v.unit || undefined, reference: v.reference || undefined };
    } else {
      path = "/api/stock/adjustments";
      body = { storeId: num("storeId"), itemId: num("itemId"), quantity: num("quantity"), unit: v.unit || undefined, reasonCode: v.reasonCode, note: v.note || undefined };
    }
    try {
      await api(path, { method: "POST", body: JSON.stringify(body) });
      setMsg({ ok: true, text: mode === "Adjust" ? "Adjustment recorded (large ones wait for approval)." : `${mode} posted.` });
      onDone();
    } catch (ex) { setMsg({ ok: false, text: ex instanceof Error ? ex.message : "Failed" }); }
    finally { setBusy(false); }
  }

  const StoreSel = ({ k, label }: { k: string; label: string }) => (
    <label className="text-xs text-muted flex flex-col gap-1">{label}
      <select required value={v[k] ?? ""} onChange={(e) => set(k, e.target.value)} className={sel}>
        <option value="">Select...</option>{stores.map((s) => <option key={s.id} value={s.id}>{s.code}</option>)}
      </select></label>
  );

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex flex-wrap gap-1">
        {MODES.map((m) => (
          <button key={m} onClick={() => { setMode(m); setMsg(null); }} className="relative px-3 py-1.5 text-sm rounded-lg">
            {mode === m && <motion.span layoutId="act-mode" className="absolute inset-0 rounded-lg bg-teal/25 border border-teal/50" />}
            <span className={`relative ${mode === m ? "text-white" : "text-muted"}`}>{m}</span>
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        {mode === "Transfer" ? (<><StoreSel k="fromStoreId" label="From store" /><StoreSel k="toStoreId" label="To store" /></>) : (<div className="col-span-2"><StoreSel k="storeId" label="Store" /></div>)}
        <label className="text-xs text-muted flex flex-col gap-1 col-span-2">Item
          <select required value={v.itemId ?? ""} onChange={(e) => set("itemId", e.target.value)} className={sel}>
            <option value="">Select...</option>{items.map((i) => <option key={i.id} value={i.id}>{i.code} - {i.name}</option>)}
          </select></label>
        <label className="text-xs text-muted flex flex-col gap-1">{mode === "Adjust" ? "Quantity (+/-)" : "Quantity"}
          <input required type="number" step="any" value={v.quantity ?? ""} onChange={(e) => set("quantity", e.target.value)} className={sel} /></label>
        <label className="text-xs text-muted flex flex-col gap-1">Unit (default: item unit)
          <select value={v.unit ?? ""} onChange={(e) => set("unit", e.target.value)} className={sel}>
            <option value="">Item unit</option>{units.map((u) => <option key={u.code}>{u.code}</option>)}
          </select></label>
        {mode === "Receive" && <label className="text-xs text-muted flex flex-col gap-1 col-span-2">Lot code (traceability)
          <input value={v.lotCode ?? ""} onChange={(e) => set("lotCode", e.target.value)} className={sel} /></label>}
        {mode === "Adjust" ? (<>
          <label className="text-xs text-muted flex flex-col gap-1">Reason *
            <select required value={v.reasonCode ?? ""} onChange={(e) => set("reasonCode", e.target.value)} className={sel}>
              <option value="">Select...</option>{REASONS.map((r) => <option key={r}>{r}</option>)}
            </select></label>
          <label className="text-xs text-muted flex flex-col gap-1">Note
            <input value={v.note ?? ""} onChange={(e) => set("note", e.target.value)} className={sel} /></label>
        </>) : (
          <label className="text-xs text-muted flex flex-col gap-1 col-span-2">Reference
            <input value={v.reference ?? ""} onChange={(e) => set("reference", e.target.value)} className={sel} /></label>
        )}
        <div className="col-span-2 flex items-center gap-3">
          <button disabled={!live || busy} title={live ? "" : "Start the backend to post stock"} className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-[#04121f] disabled:opacity-40 disabled:cursor-not-allowed">
            {busy ? "Posting..." : `Post ${mode.toLowerCase()}`}
          </button>
          {msg && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-sm ${msg.ok ? "text-[#3ddc97]" : "text-[#ff6b6b]"}`}>{msg.text}</motion.span>}
        </div>
      </form>
    </div>
  );
}
