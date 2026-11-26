const TONES: Record<string, string> = {
  RAW_MATERIAL: "bg-amber/15 text-amber", SEMI_FINISHED: "bg-teal/20 text-glow", FINISHED: "bg-[#3ddc97]/15 text-[#3ddc97]",
  PACKAGING: "bg-white/10 text-muted", SUPPLIER: "bg-amber/15 text-amber", CUSTOMER: "bg-teal/20 text-glow",
  DISTRIBUTOR: "bg-[#3ddc97]/15 text-[#3ddc97]", AGENT: "bg-purple-400/15 text-purple-300",
  ACTIVE: "bg-[#3ddc97]/15 text-[#3ddc97]", ON_HOLD: "bg-amber/15 text-amber", BLOCKED: "bg-[#ff6b6b]/15 text-[#ff6b6b]",
};
export default function Badge({ value }: { value: string }) {
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] ${TONES[value] ?? "bg-white/10 text-muted"}`}>{value.replace("_", " ")}</span>;
}
