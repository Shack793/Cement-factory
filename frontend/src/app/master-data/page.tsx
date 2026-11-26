"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useList } from "@/lib/useList";
import { SAMPLE_DRIVERS, SAMPLE_ITEMS, SAMPLE_PARTIES, SAMPLE_UNITS, SAMPLE_VEHICLES } from "@/lib/sample";
import type { Driver, Item, Party, Unit, Vehicle } from "@/lib/types";
import DataTable from "@/components/DataTable";
import AddForm from "@/components/AddForm";
import Badge from "@/components/Badge";
import PalletSceneLoader from "@/components/PalletSceneLoader";

const TABS = ["Items", "Parties", "Vehicles", "Drivers", "Units"] as const;
type Tab = (typeof TABS)[number];
const fmt = (n?: number | null) => (n == null ? "-" : n.toLocaleString());

function Converter({ units }: { units: Unit[] }) {
  const [from, setFrom] = useState("BAG");
  const [to, setTo] = useState("MT");
  const [qty, setQty] = useState("40");
  const result = useMemo(() => {
    const f = units.find((u) => u.code === from), t = units.find((u) => u.code === to);
    if (!f || !t || qty === "") return null;
    return (Number(qty) * f.kgFactor) / t.kgFactor;
  }, [units, from, to, qty]);
  const sel = "rounded-md bg-[#0a1626] border border-line px-2 py-2 text-sm text-white";
  return (
    <div className="glass p-5 space-y-4">
      <div className="text-xs uppercase tracking-widest text-muted">Unit converter (PDF 3.4)</div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className={`${sel} w-24`} />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className={sel}>{units.map((u) => <option key={u.code}>{u.code}</option>)}</select>
        <span className="text-muted">=</span>
        <select value={to} onChange={(e) => setTo(e.target.value)} className={sel}>{units.map((u) => <option key={u.code}>{u.code}</option>)}</select>
      </div>
      <motion.div key={`${from}${to}${qty}`} initial={{ scale: 0.9, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-semibold glow-text">
        {result == null ? "-" : result.toLocaleString(undefined, { maximumFractionDigits: 4 })} <span className="text-lg text-muted">{to}</span>
      </motion.div>
      <p className="text-xs text-muted">Every conversion goes through kilograms, so bag, pallet, tonne and jumbo always agree.</p>
    </div>
  );
}

export default function MasterData() {
  const [tab, setTab] = useState<Tab>("Items");
  const items = useList<Item>("/api/items", SAMPLE_ITEMS);
  const parties = useList<Party>("/api/parties", SAMPLE_PARTIES);
  const vehicles = useList<Vehicle>("/api/vehicles", SAMPLE_VEHICLES);
  const drivers = useList<Driver>("/api/drivers", SAMPLE_DRIVERS);
  const units = useList<Unit>("/api/units", SAMPLE_UNITS);
  const live = items.live;
  const unitCodes = units.data.map((u) => u.code);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.25em] text-glow">Milestone 1 - PDF section 4.1</div>
        <h1 className="text-3xl font-semibold glow-text">Master data</h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">One code per item, party, truck and driver, used by every module. Units convert through kilograms.</p>
        {!live && (
          <div className="mt-3 inline-block rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-xs text-amber">
            Backend offline: showing demo data. Start Spring Boot to add and edit records.
          </div>
        )}
      </header>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-4 min-w-0">
          <div className="relative flex gap-1 border-b border-line">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`relative px-4 py-2 text-sm ${tab === t ? "text-white" : "text-muted hover:text-white"}`}>
                {t}
                {tab === t && <motion.span layoutId="md-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-glow shadow-[0_0_12px_#3ed6ec]" />}
              </button>
            ))}
          </div>

          {tab === "Items" && (
            <div className="space-y-3">
              <AddForm title="Add item" path="/api/items" live={live} onDone={items.reload} fields={[
                { name: "code", label: "Code", required: true }, { name: "name", label: "Name", required: true },
                { name: "type", label: "Type", type: "select", options: ["RAW_MATERIAL", "SEMI_FINISHED", "FINISHED", "PACKAGING"], required: true },
                { name: "baseUnit", label: "Base unit", type: "select", options: unitCodes, required: true },
                { name: "grade", label: "Grade" }, { name: "reorderLevelKg", label: "Reorder level (kg)", type: "number" },
              ]} />
              <DataTable<Item> rows={items.data} cols={[
                { label: "Code", render: (r) => <span className="font-mono text-glow">{r.code}</span> },
                { label: "Name", render: (r) => r.name },
                { label: "Type", render: (r) => <Badge value={r.type} /> },
                { label: "Unit", render: (r) => r.baseUnit },
                { label: "Grade", render: (r) => r.grade ?? "-" },
                { label: "Reorder (kg)", align: "right", render: (r) => fmt(r.reorderLevelKg) },
              ]} />
            </div>
          )}

          {tab === "Parties" && (
            <div className="space-y-3">
              <AddForm title="Add party" path="/api/parties" live={live} onDone={parties.reload} fields={[
                { name: "code", label: "Code", required: true }, { name: "name", label: "Name", required: true },
                { name: "type", label: "Type", type: "select", options: ["SUPPLIER", "CUSTOMER", "DISTRIBUTOR", "AGENT"], required: true },
                { name: "region", label: "Region" }, { name: "phone", label: "Phone" },
                { name: "creditLimit", label: "Credit limit (GHS)", type: "number" }, { name: "paymentTermsDays", label: "Terms (days)", type: "number" },
              ]} />
              <DataTable<Party> rows={parties.data} cols={[
                { label: "Code", render: (r) => <span className="font-mono text-glow">{r.code}</span> },
                { label: "Name", render: (r) => <div>{r.name}{r.agentName && <div className="text-[11px] text-muted">via {r.agentName}</div>}</div> },
                { label: "Type", render: (r) => <Badge value={r.type} /> },
                { label: "Region", render: (r) => r.region ?? "-" },
                { label: "Credit limit", align: "right", render: (r) => fmt(r.creditLimit) },
                { label: "Terms", align: "right", render: (r) => `${r.paymentTermsDays} d` },
                { label: "Status", render: (r) => <Badge value={r.status} /> },
              ]} />
            </div>
          )}

          {tab === "Vehicles" && (
            <div className="space-y-3">
              <AddForm title="Add vehicle" path="/api/vehicles" live={live} onDone={vehicles.reload} fields={[
                { name: "registration", label: "Registration", required: true }, { name: "storedTareKg", label: "Stored tare (kg)", type: "number" },
                { name: "capacityKg", label: "Capacity (kg)", type: "number" }, { name: "grossLimitKg", label: "Gross limit (kg)", type: "number" },
                { name: "ownerName", label: "Owner" },
              ]} />
              <DataTable<Vehicle> rows={vehicles.data} cols={[
                { label: "Registration", render: (r) => <span className="font-mono text-glow">{r.registration}</span> },
                { label: "Owner", render: (r) => r.ownerName ?? "-" },
                { label: "Stored tare (kg)", align: "right", render: (r) => fmt(r.storedTareKg) },
                { label: "Capacity (kg)", align: "right", render: (r) => fmt(r.capacityKg) },
                { label: "Gross limit (kg)", align: "right", render: (r) => fmt(r.grossLimitKg) },
              ]} />
            </div>
          )}

          {tab === "Drivers" && (
            <div className="space-y-3">
              <AddForm title="Add driver" path="/api/drivers" live={live} onDone={drivers.reload} fields={[
                { name: "name", label: "Name", required: true }, { name: "licenseNo", label: "Licence no." },
                { name: "phone", label: "Phone" }, { name: "idNumber", label: "ID number" },
              ]} />
              <DataTable<Driver> rows={drivers.data} cols={[
                { label: "Name", render: (r) => r.name }, { label: "Licence", render: (r) => <span className="font-mono">{r.licenseNo ?? "-"}</span> },
                { label: "Phone", render: (r) => r.phone ?? "-" },
              ]} />
            </div>
          )}

          {tab === "Units" && (
            <DataTable<Unit> rows={units.data} cols={[
              { label: "Code", render: (r) => <span className="font-mono text-glow">{r.code}</span> },
              { label: "Name", render: (r) => r.name },
              { label: "Weight per unit (kg)", align: "right", render: (r) => fmt(r.kgFactor) },
            ]} />
          )}
        </div>

        <aside className="space-y-4">
          <div className="glass h-64 overflow-hidden"><PalletSceneLoader /></div>
          <Converter units={units.data} />
        </aside>
      </div>
    </div>
  );
}
