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
