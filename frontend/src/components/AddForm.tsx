"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export type Field = { name: string; label: string; type?: "text" | "number" | "select"; options?: string[]; required?: boolean };

export default function AddForm({
  title, path, fields, live, onDone,
}: { title: string; path: string; fields: Field[]; live: boolean; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const body: Record<string, unknown> = {};
    for (const f of fields) {
      const v = vals[f.name];
      if (v === undefined || v === "") continue;
      body[f.name] = f.type === "number" ? Number(v) : v;
    }
    try {
      await api(path, { method: "POST", body: JSON.stringify(body) });
      setVals({}); setOpen(false); onDone();
    } catch (ex) { setErr(ex instanceof Error ? ex.message : "Failed"); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!live}
        title={live ? "" : "Start the backend to add records"}
        className="rounded-lg bg-teal/90 hover:bg-teal px-4 py-2 text-sm font-medium text-[#04121f] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {open ? "Close" : `+ ${title}`}
      </button>
      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass mt-3 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {fields.map((f) => (
                <label key={f.name} className="text-xs text-muted flex flex-col gap-1">
                  {f.label}{f.required && " *"}
                  {f.type === "select" ? (
                    <select required={f.required} value={vals[f.name] ?? ""} onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })}
                      className="rounded-md bg-[#0a1626] border border-line px-2 py-2 text-sm text-white">
                      <option value="">Select...</option>
                      {f.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input required={f.required} type={f.type === "number" ? "number" : "text"} step="any" value={vals[f.name] ?? ""}
                      onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })}
                      className="rounded-md bg-[#0a1626] border border-line px-2 py-2 text-sm text-white" />
                  )}
                </label>
              ))}
              <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-3">
                <button disabled={busy} className="rounded-lg bg-[#3ddc97] px-4 py-2 text-sm font-medium text-[#04121f] disabled:opacity-50">
                  {busy ? "Saving..." : "Save"}
                </button>
                {err && <span className="text-sm text-[#ff6b6b]">{err}</span>}
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
