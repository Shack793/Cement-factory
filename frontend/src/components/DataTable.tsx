"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type Col<T> = { label: string; render: (row: T) => ReactNode; align?: "right" };

export default function DataTable<T extends { id: number }>({ cols, rows }: { cols: Col<T>[]; rows: T[] }) {
  return (
    <div className="glass overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-widest text-muted border-b border-line">
            {cols.map((c) => <th key={c.label} className={`px-4 py-3 font-medium ${c.align === "right" ? "text-right" : ""}`}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="border-b border-line/50 hover:bg-teal/10 transition-colors"
            >
              {cols.map((c) => <td key={c.label} className={`px-4 py-3 ${c.align === "right" ? "text-right tabular-nums" : ""}`}>{c.render(r)}</td>)}
            </motion.tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={cols.length} className="px-4 py-8 text-center text-muted">No records</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
