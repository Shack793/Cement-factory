export type ModuleItem = { href: string; label: string; milestone: number; group: string };

// Milestone numbers match docs/MILESTONES.md
export const MODULES: ModuleItem[] = [
  { href: "/", label: "Dashboard", milestone: 0, group: "Overview" },
  { href: "/master-data", label: "Master data", milestone: 1, group: "Foundation" },
  { href: "/stock", label: "Stores and stock", milestone: 2, group: "Foundation" },
  { href: "/production", label: "Production", milestone: 3, group: "Foundation" },
  { href: "/purchasing", label: "Purchasing and inbound", milestone: 4, group: "Foundation" },
  { href: "/orders", label: "Orders, credit, payments", milestone: 5, group: "Commercial" },
  { href: "/weighbridge", label: "Weighbridge and gate", milestone: 6, group: "Plant gate" },
  { href: "/portal", label: "Distributor portal", milestone: 7, group: "Commercial" },
  { href: "/reports", label: "Reports and audit", milestone: 8, group: "Control" },
];

// Update this as milestones are completed and pushed.
export const COMPLETED_MILESTONES = [0, 1, 2];
