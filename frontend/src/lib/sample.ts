import type { Unit, Item, Party, Vehicle, Driver } from "./types";

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
