# Cement Factory System - Milestones

Source of truth: `Cement_Operations_System_on_iProduction_v0.4.pdf` (section numbers below refer to it).
Each milestone is pushed to GitHub as its own commit(s) when complete.

| # | Milestone | PDF sections | Backend (Spring Boot, MVC) | Frontend (Next.js, 3D) |
|---|-----------|--------------|----------------------------|------------------------|
| 0 | Foundation and repo | 1, 2, 6 | Project skeleton, layers, health API | Next.js shell, theme, 3D hero scene |
| 1 | Master data | 4.1 | Items, units and conversions, parties, vehicles and drivers | Master data screens, animated dashboard cards |
| 2 | Stores and stock | 3.1-3.4, 4.2 | Stores (yard, silos, finished goods), stock ledger, lots, adjustments | 3D plant view: yard, silos with live levels, warehouse |
| 3 | Recipes and production | 3.5-3.7, 4.3, 14.2 | BOM, grinding run, bagging run, pallets, QC release, leftover return | Production flow board, run wizard, animated flow |
| 4 | Purchasing and inbound weighbridge | 4.4, 10.5, 14.1 | Suppliers, PO, GRN, weighbridge tickets (inbound) | Inbound lane screen, live ticket, weight display |
| 5 | Orders, credit and payments | 8, 9 | Sales orders, price lists, credit rules, payments, allocation, ledger | Order wizard, credit gauge, payment flow |
| 6 | Outbound weighbridge, gate and loading | 10.6-10.10, 11 | Release, gate events, loading, outbound ticket, gate-out rules | 3D truck lane: gate, tare, bay, gross, exit |
| 7 | Distributor portal and delivery | 7, 12 | Portal auth, statements, dispatch, proof of delivery, notifications | Portal UI, order tracking map, statements |
| 8 | Dashboards, reports, roles, audit | 16, 17 | RBAC, audit trail, exceptions, report endpoints | Executive dashboard, exception center |
| 9 | Hardening and deployment | 15, 19, 20 | Tests, Docker, CI, edge-server notes | Polish, performance, docs |

## Progress

- [x] M0 Foundation and repo
- [x] M1 Master data (units and conversions, items, parties, vehicles, drivers; seed data from the PDF; 3D pallet; unit converter)
- [x] M2 Stores and stock (8 stores, ledger, lots, adjustments with approval, silo rules, low-stock alerts, data-driven 3D plant)
- [ ] M3 Recipes and production
- [ ] M4 Purchasing and inbound weighbridge
- [ ] M5 Orders, credit and payments
- [ ] M6 Outbound weighbridge, gate and loading
- [ ] M7 Distributor portal and delivery
- [ ] M8 Dashboards, reports, roles, audit
- [ ] M9 Hardening and deployment

### API (M1)
`GET/POST /api/units`, `GET /api/units/convert?from=BAG&to=MT&qty=40`, `GET/POST/PUT/DELETE /api/items`,
`/api/parties` (+ `PATCH /api/parties/{id}/status?value=ON_HOLD`), `/api/vehicles`, `/api/drivers`.
Note: backend code could not be compiled in the authoring sandbox (no Maven Central access); run `mvn test` first.

### API (M2)
`GET /api/stores`, `POST /api/stores`, `GET /api/stock/balances|low|movements|adjustments/pending`,
`POST /api/stock/receipts|issues|transfers|adjustments`, `POST /api/stock/adjustments/{id}/approve|reject`.
