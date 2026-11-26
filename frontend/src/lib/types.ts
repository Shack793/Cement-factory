export type ItemType = "RAW_MATERIAL" | "SEMI_FINISHED" | "FINISHED" | "PACKAGING";
export type PartyType = "SUPPLIER" | "CUSTOMER" | "DISTRIBUTOR" | "AGENT";
export type PartyStatus = "ACTIVE" | "ON_HOLD" | "BLOCKED";

export interface Unit { id: number; code: string; name: string; kgFactor: number }
export interface Item { id: number; code: string; name: string; type: ItemType; baseUnit: string; grade?: string | null; reorderLevelKg?: number | null; active: boolean }
export interface Party {
  id: number; code: string; name: string; type: PartyType; phone?: string | null; region?: string | null;
  country?: string | null; port?: string | null; creditLimit: number; paymentTermsDays: number; status: PartyStatus; agentName?: string | null;
}
export interface Vehicle { id: number; registration: string; storedTareKg?: number | null; capacityKg?: number | null; grossLimitKg?: number | null; ownerName?: string | null; active: boolean }
export interface Driver { id: number; name: string; licenseNo?: string | null; phone?: string | null; active: boolean }

export type StoreType = "RAW_YARD" | "PACKAGING" | "MANUFACTURING_ROOM" | "SILO" | "FINISHED_GOODS" | "QUARANTINE";
export interface BalanceLine { storeId: number; storeCode: string; itemId: number; itemCode: string; itemName: string; unit: string; quantity: number; quantityKg: number }
export interface Store {
  id: number; code: string; name: string; type: StoreType; capacityKg?: number | null; assignedItemId?: number | null;
  assignedItemCode?: string | null; active: boolean; usedKg: number; utilizationPct?: number | null; lines: BalanceLine[];
}
export interface Movement {
  id: number; storeCode: string; itemCode: string; itemName: string; lotCode?: string | null; quantity: number; unit: string;
  type: string; status: "POSTED" | "PENDING" | "REJECTED"; reference?: string | null; reasonCode?: string | null; note?: string | null; createdAt: string;
}
export interface LowStock { itemId: number; itemCode: string; itemName: string; unit: string; quantity: number; quantityKg: number; reorderLevelKg: number; shortfallKg: number }
