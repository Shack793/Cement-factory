"use client";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function StatCard({
  label, value, unit, hint, delay = 0, accent = "#3ed6ec",
}: { label: string; value: number; unit: string; hint: string; delay?: number; accent?: string }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    const c = animate(mv, value, { duration: 1.6, delay, ease: "easeOut" });
    return () => c.stop();
  }, [mv, value, delay]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass p-5 relative overflow-hidden"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-40" style={{ background: accent }} />
      <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <motion.span className="text-3xl font-semibold glow-text">{text}</motion.span>
        <span className="text-sm text-muted">{unit}</span>
      </div>
      <div className="mt-1 text-xs text-muted">{hint}</div>
    </motion.div>
  );
}
