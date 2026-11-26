import type { Unit, Item, Party, Vehicle, Driver, Store, Movement, LowStock } from "./types";

// Offline demo data that mirrors the backend DataSeeder (used when Spring Boot is not running).
export const SAMPLE_UNITS: Unit[] = [
  { id: 1, code: "KG", name: "Kilogram", kgFactor: 1 },
  { id: 2, code: "MT", name: "Tonne", kgFactor: 1000 },
  { id: 3, code: "BAG", name: "Bag (50 kg)", kgFactor: 50 },
  { id: 4, code: "PALLET", name: "Pallet (40 bags)", kgFactor: 2000 },
  { id: 5, code: "JUMBO", name: "Jumbo bag (1 MT)", kgFactor: 1000 },
];
export const SAMPLE_ITEMS: Item[] = [
  { id: 1, code: "CLINKER", name: "Clinker", type: "RAW_MATERIAL", baseUnit: "MT", reorderLevelKg: 250000, active: true },
  { id: 2, code: "GYPSUM", name: "Gypsum", type: "RAW_MATERIAL", baseUnit: "MT", reorderLevelKg: 20000, active: true },
  { id: 3, code: "FLYASH", name: "Fly ash / slag", type: "RAW_MATERIAL", baseUnit: "MT", reorderLevelKg: 30000, active: true },
  { id: 4, code: "LIMESTONE", name: "Limestone (own kiln only)", type: "RAW_MATERIAL", baseUnit: "MT", active: true },
  { id: 5, code: "CLAY", name: "Clay / shale (own kiln only)", type: "RAW_MATERIAL", baseUnit: "MT", active: true },
  { id: 6, code: "PACKBAG", name: "Empty packing bag 50 kg", type: "PACKAGING", baseUnit: "BAG", reorderLevelKg: 20000, active: true },
  { id: 7, code: "CEM425R-BULK", name: "Cement 42.5R powder (silo)", type: "SEMI_FINISHED", baseUnit: "MT", grade: "42.5R", active: true },
  { id: 8, code: "CEM325R-BULK", name: "Cement 32.5R powder (silo)", type: "SEMI_FINISHED", baseUnit: "MT", grade: "32.5R", active: true },
  { id: 9, code: "CEM425R-50", name: "Super Strong 42.5R, 50 kg bag", type: "FINISHED", baseUnit: "BAG", grade: "42.5R", active: true },
  { id: 10, code: "CEM325R-50", name: "Super Rapid 32.5R, 50 kg bag", type: "FINISHED", baseUnit: "BAG", grade: "32.5R", active: true },
  { id: 11, code: "CEM425N-50", name: "Extra / Premium 42.5N, 50 kg bag", type: "FINISHED", baseUnit: "BAG", grade: "42.5N", active: true },
];
export const SAMPLE_PARTIES: Party[] = [
  { id: 1, code: "AG-001", name: "Kwame Mensah Trading", type: "AGENT", region: "Greater Accra", creditLimit: 0, paymentTermsDays: 0, status: "ACTIVE" },
  { id: 2, code: "SUP-001", name: "Anatolia Clinker Ltd", type: "SUPPLIER", region: "Turkey", country: "Turkey", port: "Tema Port", creditLimit: 0, paymentTermsDays: 30, status: "ACTIVE" },
  { id: 3, code: "SUP-002", name: "Volta Gypsum Mines", type: "SUPPLIER", region: "Volta", creditLimit: 0, paymentTermsDays: 0, status: "ACTIVE" },
  { id: 4, code: "DIS-001", name: "Asante Building Supplies", type: "DISTRIBUTOR", region: "Ashanti", creditLimit: 100000, paymentTermsDays: 14, status: "ACTIVE", agentName: "Kwame Mensah Trading" },
  { id: 5, code: "DIS-002", name: "Tema Block Works", type: "DISTRIBUTOR", region: "Greater Accra", creditLimit: 250000, paymentTermsDays: 30, status: "ACTIVE" },
];
export const SAMPLE_VEHICLES: Vehicle[] = [
  { id: 1, registration: "GT-1234-24", storedTareKg: 14200, capacityKg: 30000, grossLimitKg: 50000, ownerName: "Own fleet", active: true },
  { id: 2, registration: "AS-5521-23", storedTareKg: 15100, capacityKg: 32000, grossLimitKg: 50000, ownerName: "Kofi Transport", active: true },
];
export const SAMPLE_DRIVERS: Driver[] = [
  { id: 1, name: "Yaw Boateng", licenseNo: "DL-0012345", phone: "0244000001", active: true },
  { id: 2, name: "Ama Serwaa", licenseNo: "DL-0098765", phone: "0244000002", active: true },
];

const L = (storeId: number, storeCode: string, itemId: number, itemCode: string, itemName: string, unit: string, quantity: number, f: number) =>
  ({ storeId, storeCode, itemId, itemCode, itemName, unit, quantity, quantityKg: quantity * f });
export const SAMPLE_STORES: Store[] = [
  { id: 1, code: "RAW-YARD", name: "Raw Material Yard", type: "RAW_YARD", capacityKg: 20000000, active: true, usedKg: 348000, utilizationPct: 1.7,
    lines: [L(1, "RAW-YARD", 1, "CLINKER", "Clinker", "MT", 300, 1000), L(1, "RAW-YARD", 2, "GYPSUM", "Gypsum", "MT", 8, 1000), L(1, "RAW-YARD", 3, "FLYASH", "Fly ash / slag", "MT", 40, 1000)] },
  { id: 2, code: "PACKAGING", name: "Packaging store", type: "PACKAGING", active: true, usedKg: 1250000, lines: [L(2, "PACKAGING", 6, "PACKBAG", "Empty packing bag 50 kg", "BAG", 25000, 50)] },
  { id: 3, code: "MFG-ROOM", name: "Manufacturing Room (work in progress)", type: "MANUFACTURING_ROOM", active: true, usedKg: 0, lines: [] },
  { id: 4, code: "SILO-CLK", name: "Silo 1 - Clinker", type: "SILO", capacityKg: 1000000, assignedItemCode: "CLINKER", active: true, usedKg: 500000, utilizationPct: 50, lines: [L(4, "SILO-CLK", 1, "CLINKER", "Clinker", "MT", 500, 1000)] },
  { id: 5, code: "SILO-425", name: "Silo 2 - Cement 42.5R", type: "SILO", capacityKg: 500000, assignedItemCode: "CEM425R-BULK", active: true, usedKg: 180000, utilizationPct: 36, lines: [L(5, "SILO-425", 7, "CEM425R-BULK", "Cement 42.5R powder (silo)", "MT", 180, 1000)] },
  { id: 6, code: "SILO-325", name: "Silo 3 - Cement 32.5R", type: "SILO", capacityKg: 500000, assignedItemCode: "CEM325R-BULK", active: true, usedKg: 120000, utilizationPct: 24, lines: [L(6, "SILO-325", 8, "CEM325R-BULK", "Cement 32.5R powder (silo)", "MT", 120, 1000)] },
  { id: 7, code: "FG-WH", name: "Finished Goods Warehouse", type: "FINISHED_GOODS", capacityKg: 2500000, active: true, usedKg: 325000, utilizationPct: 13,
    lines: [L(7, "FG-WH", 9, "CEM425R-50", "Super Strong 42.5R, 50 kg bag", "BAG", 4000, 50), L(7, "FG-WH", 10, "CEM325R-50", "Super Rapid 32.5R, 50 kg bag", "BAG", 2500, 50)] },
  { id: 8, code: "QUARANTINE", name: "Quarantine", type: "QUARANTINE", active: true, usedKg: 0, lines: [] },
];
export const SAMPLE_LOW: LowStock[] = [
  { itemId: 2, itemCode: "GYPSUM", itemName: "Gypsum", unit: "MT", quantity: 8, quantityKg: 8000, reorderLevelKg: 20000, shortfallKg: 12000 },
];
const mv = (id: number, storeCode: string, itemCode: string, itemName: string, quantity: number, unit: string): Movement =>
  ({ id, storeCode, itemCode, itemName, quantity, unit, type: "OPENING", status: "POSTED", reference: "OPENING", createdAt: new Date().toISOString() });
export const SAMPLE_MOVEMENTS: Movement[] = [
  mv(9, "FG-WH", "CEM325R-50", "Super Rapid 32.5R, 50 kg bag", 2500, "BAG"),
  mv(8, "FG-WH", "CEM425R-50", "Super Strong 42.5R, 50 kg bag", 4000, "BAG"),
  mv(7, "SILO-325", "CEM325R-BULK", "Cement 32.5R powder (silo)", 120, "MT"),
  mv(6, "SILO-425", "CEM425R-BULK", "Cement 42.5R powder (silo)", 180, "MT"),
  mv(5, "SILO-CLK", "CLINKER", "Clinker", 500, "MT"),
  mv(4, "PACKAGING", "PACKBAG", "Empty packing bag 50 kg", 25000, "BAG"),
  mv(3, "RAW-YARD", "FLYASH", "Fly ash / slag", 40, "MT"),
  mv(2, "RAW-YARD", "GYPSUM", "Gypsum", 8, "MT"),
  mv(1, "RAW-YARD", "CLINKER", "Clinker", 300, "MT"),
];
