# Handoff status

Full project flow, all milestone specs and the business-rule catalogue: **`docs/ROADMAP.md`** (read it before starting a milestone).

Last updated after **M2 (Stores and stock)**.

## Done
- **M0** Foundation: repo layout, Spring Boot MVC skeleton (health, CORS, error handler), Next.js shell with 3D plant dashboard.
- **M1** Master data: units + conversions, items, parties (credit limit, terms, agent link, status), vehicles (stored tare, capacity, gross limit), drivers. Seeded from the PDF. UI with tabs, forms, converter, 3D pallet.
- **M2** Stores and stock: 8 stores (raw yard, packaging, manufacturing room, 3 silos, finished goods, quarantine), stock ledger with receipts, issues, transfers (two legs), adjustments (reason code; >= 5,000 kg waits for approval), lots, low-stock alerts. Rules: no negative stock, silo holds one item, capacity limits. UI: data-driven 3D plant, store cards, post-stock form, ledger.

## Endpoints available
Master data: `/api/units` (+`/convert`), `/api/items`, `/api/parties` (+`PATCH /{id}/status`), `/api/vehicles`, `/api/drivers`.
Stock: `GET /api/stores`, `POST /api/stores`, `GET /api/stock/balances|low|movements|adjustments/pending`,
`POST /api/stock/receipts|issues|transfers|adjustments`, `POST /api/stock/adjustments/{id}/approve|reject`.
Reusable from other services: `StockService.balanceOf(storeId, itemId)`, `openingBalance(...)`; add new public methods (e.g. `postProduction...`) rather than writing to the repository directly.

## Known caveats
- The backend was authored in a sandbox **without Maven Central access**, so it has **never been compiled or run**. First action for any agent with Maven: `cd backend && mvn test`, fix any compile/test errors, and note it here.
- The frontend builds (`npx next build`) and renders (verified by screenshots) with sample data. It has not been exercised against a running backend.
- Stock balance reads are not concurrency-safe (no locking). Add `@Lock`/optimistic versioning in M9 or when production runs post concurrently.
- No authentication yet (planned in M8 RBAC; portal auth in M7).

## Next task: M3 Recipes and production (PDF 3.5 to 3.7, 4.3, 14.2, 14.3)
Backend:
1. `Recipe` (+ `RecipeLine`): product item, version, status, kg per tonne lines (clinker, gypsum, fly ash), allowed variance %, expected yield. Seed: 42.5R = 950/50/0, 32.5R = 850/50/100 (PDF 3.6). Bagging recipe: 50 kg silo cement + 1 `PACKBAG` per bag.
2. `ProductionRun` (type GRINDING or BAGGING; number `PROD-`/`BAG-yyyymmdd-nnn`; shift, mill/packer line; status Planned, In progress, Awaiting QC, Completed, Cancelled).
   - GRINDING: input tonnes -> check stock of raw materials in `MFG-ROOM` (transfer from `RAW-YARD` first, PDF 14.2) -> consume per recipe -> add cement powder to the matching silo. If short, return a 422 listing every short material ("Clinker: have 15 MT, need 95 MT", PDF 3.7).
   - BAGGING: draw MT from silo + packing bags -> add bags to `FG-WH`; create `Pallet` records (40 bags = 1 pallet, code `PL-yyyymmdd-nnnnn`, batch code linking run + silo lot).
   - Quality hold: silo lot / pallets Held until QC releases (add simple `QualityResult` + release/hold/reject).
   - Leftover return (PDF 14.3): `RET-` document moving unused material from `MFG-ROOM` back to yard, or to `QUARANTINE`/write-off.
   - Losses (dust, burst bags) recorded with reason codes; show cost per tonne once costs exist (can be a later field).
3. Use `StockService` for all stock postings (add `PRODUCTION_IN/OUT` movement types already in the enum).
Frontend `/production`: run wizard (choose grade, tonnes -> preview recipe consumption with shortage in red), animated flow board raw yard -> silo -> finished goods (reuse `FlowStrip` style), run list, QC release panel, pallet list. Add sample data for offline.
Then update `COMPLETED_MILESTONES` to include 3.

## Later milestones
See `docs/MILESTONES.md` (M4 purchasing + inbound weighbridge, M5 orders/credit/payments, M6 outbound weighbridge/gate/loading with 3D truck lane, M7 portal + delivery, M8 dashboards/RBAC/audit, M9 hardening).
