# Cement Factory System - Full Roadmap (for humans and AI agents)

Read order for a new agent: `AGENTS.md` (conventions) -> this file (whole project) -> `docs/HANDOFF.md` (current status and the very next task).
Functional source of truth: `docs/Cement_Operations_System_on_iProduction_v0.4.pdf` (section numbers like "PDF 10.7" refer to it).
This file explains the **flow of the entire project**, so any milestone can be built without re-reading everything.

---------------------------------------------------------------------------------------------------

## 1. What we are building

A cement manufacturing and distribution platform for a Ghanaian plant, in the spirit of **iProduction** (production + inventory + sales +
accounting) but with extra modules iProduction lacks: distributor ordering, credit and payments, **inbound and outbound weighbridge**, gate
and loading control, delivery tracking and a distributor portal. The UI must be visually rich: animation (Framer Motion) and 3D (React Three Fiber).

Stack: Spring Boot 3 (Java 21, **MVC**: controller / service / repository / model / dto), React with Next.js 16 (App Router), Tailwind 4.
Database: H2 locally, PostgreSQL for production.

Non-negotiable principles (PDF 6.1):
1. One database, one set of codes (items, parties, stores, vehicles exist once).
2. Document-driven: every stock or money change is a numbered document with user, time, status.
3. Stock is a ledger. Never store balances: In - Out = Balance.
4. Weigh every truck both ways. Net weight is the evidence behind receipts, dispatches and invoices.
5. Controls before, not after: credit/payment/release checks before a truck is queued; ticket check before the barrier opens.
6. Gate and weighbridge must work offline (edge server) and sync later (designed in M6, hardened in M9).

---------------------------------------------------------------------------------------------------

## 2. End-to-end business flow (the spine of the system)

```
 SUPPLY SIDE                                              PRODUCTION                                  
 PO (M4) -> truck at gate -> WEIGH IN gross (M4) -> offload to pile -> WEIGH OUT tare -> net
         -> quality sample -> GRN posts stock: RAW-YARD +net (M4 -> StockService)
 RAW-YARD --transfer--> MFG-ROOM (M2/M3)
 GRINDING RUN (M3): consume clinker+gypsum(+fly ash) per recipe from MFG-ROOM -> cement powder into SILO (tonnes)
 QC on silo lot (M3): release / hold / reject
 BAGGING RUN (M3): silo tonnes + packing bags -> bags on pallets (40 bags = 2 MT) -> FG-WH (bags), batch code per pallet

 SALES SIDE
 Distributor/agent/staff ORDER (M5/M7) -> price list + CREDIT CHECK (M5) -> approval -> PAYMENT/credit -> INVOICE
         -> RELEASE with truck slot, stock RESERVED (M5/M6)

 DISPATCH (PDF 10.6/10.7, built in M6)
 truck arrives -> gate check (QR/plate, driver, order Released) -> queue/bay -> WEIGH IN tare (ticket WB opened)
         -> LOAD (pallets FIFO by batch, QC-released only; or bulk from silo spout, seal) -> loading confirmed
         -> WEIGH OUT gross -> net + checks (stable, tare drift, bags x 50 kg + pallets, overload, ordered vs loaded)
         -> ticket Completed -> papers (loading ticket, waybill) -> GATE OUT (ticket+plate+driver+seal match)
         -> stock deducted (FG bags, or silo MT for bulk) -> dispatch record + notification -> tracking
         -> proof of delivery (M7) -> invoice finalised/closed -> statement/ledger updated
```

Stock points and units (PDF 3): RAW-YARD (MT) -> SILOS (MT) -> FG-WH (bags/pallets). 1 bag = 50 kg; 1 pallet = 40 bags = 2 MT; 1 MT = 20 bags.
Recipes per 1 MT (PDF 3.6): 42.5R = clinker 950 + gypsum 50 kg; 32.5R = clinker 850 + gypsum 50 + fly ash 100 kg. Bagging: 50 kg silo cement + 1 packing bag = 1 bag.
First release products: 42.5R and 32.5R in 50 kg bags. Later: 42.5N, bulk, jumbo, clinker sales.

---------------------------------------------------------------------------------------------------

## 3. Milestones at a glance

| # | Milestone | Status | Depends on | PDF |
|---|-----------|--------|------------|-----|
| M0 | Foundation and repo | DONE | - | 1, 2, 6 |
| M1 | Master data | DONE | M0 | 4.1 |
| M2 | Stores and stock ledger | DONE | M1 | 3.1-3.4, 4.2 |
| M3 | Recipes and production (grinding, silo, bagging, QC, returns) | NEXT | M2 | 3.5-3.7, 4.3, 4.5, 14.2-14.3 |
| M4 | Purchasing and inbound weighbridge | TODO | M2 (M3 for QC reuse) | 4.4, 10.1-10.5, 14.1 |
| M5 | Orders, credit and payments | TODO | M1, M2 | 8, 9 |
| M6 | Outbound weighbridge, gate and loading | TODO | M2, M3, M4 (weighbridge core), M5 | 10.6-10.10, 11 |
| M7 | Distributor portal, delivery and notifications | TODO | M5, M6 | 7, 12 |
| M8 | Dashboards, reports, roles (RBAC) and audit | TODO | all | 16, 17, 21 |
| M9 | Hardening and deployment | TODO | all | 15, 19, 20 |

Dependency sketch: `M0 -> M1 -> M2 -> M3 -> M4 -> M6 -> M7 -> M8 -> M9` with `M5` feeding `M6` and `M7`. M4 and M5 are independent of each other and may be swapped.

---------------------------------------------------------------------------------------------------

## 4. Done milestones (summary; code is the detail)

- **M0**: repo layout, Spring Boot skeleton (`HealthController`, `CorsConfig`, `GlobalExceptionHandler`, `BaseEntity`), Next.js shell (sidebar, glass theme, 3D plant dashboard).
- **M1**: `UnitOfMeasure`, `Item`, `Party`, `Vehicle`, `Driver` + CRUD, unit conversion via kg factors, `DataSeeder`; UI `/master-data`.
- **M2**: `Store`, `Lot`, `StockMovement`; `StockService` (receive, issue, transfer, adjust with approval >= 5,000 kg, silo single-grade rule, capacity, no negative stock, low-stock); `StockSeeder` (8 stores + opening stock); UI `/stock` with data-driven 3D plant.

Stock codes: stores `RAW-YARD, PACKAGING, MFG-ROOM, SILO-CLK, SILO-425, SILO-325, FG-WH, QUARANTINE`.
Item codes: `CLINKER, GYPSUM, FLYASH, LIMESTONE, CLAY, PACKBAG, CEM425R-BULK, CEM325R-BULK, CEM425R-50, CEM325R-50, CEM425N-50`.

---------------------------------------------------------------------------------------------------

## 5. Upcoming milestones - detailed specs

Each spec lists: entities, endpoints, rules, state machines, UI, seed data, acceptance tests. Keep to `AGENTS.md` conventions.
All stock postings MUST go through `StockService` (add public methods; do not write movements from other services directly).

### M3 - Recipes and production (PDF 3.5-3.7, 4.3, 4.5, 14.2, 14.3)
Goal: two-stage production. Grinding run fills a silo (tonnes); bagging run fills the finished goods warehouse (bags on pallets).

Entities
- `Recipe` (productItem, version int, status DRAFT/ACTIVE/RETIRED, allowedVariancePct, expectedYieldPct) + `RecipeLine` (item, kgPerTonne). Seed: 42.5R (CLINKER 950, GYPSUM 50) and 32.5R (CLINKER 850, GYPSUM 50, FLYASH 100); bagging recipe lines: silo cement 50 kg + PACKBAG 1 per bag.
- `ProductionRun` (number `PROD-yyyymmdd-nnn` or `BAG-yyyymmdd-nnn`, type GRINDING|BAGGING, grade, plannedQty, actualQty, shift, equipment (mill/packer), silo store, status PLANNED/IN_PROGRESS/AWAITING_QC/COMPLETED/CANCELLED) + `RunLine` (item, store, plannedQty, actualQty, kind INPUT/OUTPUT/LOSS, reasonCode).
- `Pallet` (code `PL-yyyymmdd-nnnnn`, run, batchCode, bags=40, status IN_WAREHOUSE/RESERVED/LOADED/HELD/QUARANTINE).
- `QualityResult` (silo lot or pallet batch, fineness, settingTimeMin, strengthMpa, decision RELEASED/HELD/REJECTED, by, at).
- `LeftoverReturn` (number `RET-`, run, item, qty, condition USABLE/DAMAGED/CONTAMINATED/LOST, status DRAFT/RETURNED/RECEIVED).
Endpoints (suggested)
- `GET/POST /api/recipes`, `POST /api/recipes/{id}/activate`
- `POST /api/production/preview` {grade, tonnes} -> required vs available per material (shortages listed)
- `POST /api/production/runs` (plan), `POST /api/production/runs/{id}/start|complete|cancel`, `GET /api/production/runs`
- `GET /api/pallets`, `POST /api/quality/results`, `POST /api/production/returns`, `POST /api/production/returns/{id}/receive`
Rules
- Grinding start consumes from `MFG-ROOM` only (so a RAW-YARD -> MFG-ROOM transfer must precede it, PDF 14.2); shortage -> 422 listing every short material, e.g. "Clinker: have 15 MT, need 95 MT" (PDF 3.7).
- Grinding output goes into the grade's silo (single-grade rule already enforced); output vs recipe yield variance beyond tolerance is flagged (PDF 14.2).
- Bagging cannot draw more than the silo balance; consumes PACKBAG from `PACKAGING`; creates pallets (40 bags each, remainder as partial pallet); output to `FG-WH` in bags.
- Silo lot / pallets are HELD until QC releases; HELD or REJECTED batches cannot be loaded (enforced again in M6).
- A run cannot COMPLETE until the `MFG-ROOM` balance for that run is zero or explained (leftover return); returns are costed at issue cost (PDF 14.3).
- Losses (dust, spillage, burst bags, wet/caked) are recorded with reason codes; wet/caked goes to `QUARANTINE`.
UI `/production`: run wizard with live shortage preview, animated flow board (raw -> silo -> finished), run list with status chips, QC release panel, pallet grid (3D pallet stack reuse from M1), leftover return form. Offline sample data required.
Acceptance (use PDF 3.7 numbers): opening RAW-YARD clinker 300 MT, gypsum 8 MT. A 100 MT grinding run of 42.5R started now is **blocked** because MFG-ROOM is empty (message lists clinker 95 MT and gypsum 5 MT as short). After transferring 95 MT clinker + 5 MT gypsum from RAW-YARD to MFG-ROOM the run starts: MFG-ROOM -> 0, SILO-425 +100 MT. A bagging run of 50 MT then gives 1,000 bags = 25 pallets in FG-WH, SILO-425 -50 MT, PACKBAG -1,000. A second 100 MT run is blocked (clinker/gypsum short in MFG-ROOM).

---------------------------------------------------------------------------------------------------

### M4 - Purchasing and inbound weighbridge (PDF 4.4, 10.1-10.5, 14.1)
Entities: `PurchaseOrder` (+lines; `PO-` number; paid/credit supplier; vessel, bill of lading, port for imports), `GoodsReceipt` (`GRN-`, status DRAFT/QUALITY_HOLD/APPROVED/POSTED), `SupplierInvoice` + `SupplierPayment` (simple), `WeighbridgeTicket` (`WB-yyyymmdd-nnnn`, direction IN/OUT, mode, vehicle, driver, document link, status OPEN/COMPLETED/VOIDED/OVERRIDDEN) + `WeightEvent` (sequence, kg, stable, manual, device, photoRef, time, reweighNo) - **this ticket core is reused by M6**.
Endpoints: `/api/purchase-orders`, `/api/receipts`, `/api/weighbridge/tickets` (open with first weight, second weight, complete, void, override with supervisor), `/api/weighbridge/scale/simulate` (dev-only indicator simulator emitting stable weights).
Rules: ticket accepts only stable weights; manual weight needs second approval and is flagged; completed ticket immutable (corrections by supervisor leave a trail); inbound net = gross - tare; GRN posts `RAW-YARD` stock by **net weight** (not supplier note), variance vs delivery note recorded; imported clinker: sum of truck nets vs bill-of-lading quantity per consignment; quality hold blocks posting until released; paid supplier pays at/before delivery, credit supplier by days with ageing.
UI `/purchasing` and `/weighbridge/inbound`: PO list/wizard, **inbound lane console** with a simulated weight display, live ticket card, 3D truck driving onto the scale and pile growing on posting.
Acceptance: PO 30 MT clinker; truck gross 45,160 kg weigh-in, tare 15,100 weigh-out -> net 30,060 kg -> GRN posts +30.06 MT to RAW-YARD; ticket cannot be edited after completion.

### M5 - Orders, credit and payments (PDF 8, 9)
Entities: `PriceList` (+lines: item grade/pack, region, pickup vs delivered, price, start/end), `SalesOrder` (+lines; `SO-yyyymmdd-nnn`; channel PORTAL/APP/STAFF; payment terms; status DRAFT, SUBMITTED, HELD, APPROVED, RELEASED, PART_LOADED, LOADED, DELIVERED, CLOSED, CANCELLED), `Invoice`, `Payment` (`PAY-`; method MOBILE_MONEY/BANK/CARD/CHEQUE/CASH/WALLET; status STARTED/PENDING/CONFIRMED/ALLOCATED/FAILED/REFUNDED), `PaymentAllocation`, `Receipt` (`RC-`), `CreditNote` (`CN-`), `LedgerLine` (party, date, document, debit, credit, running balance), `AgentCommission`.
Credit math (PDF 7.4/8.5): `balance = opening + invoices - payments - credit notes`; `pendingOrders = approved not yet invoiced`; `creditAvailable = creditLimit - balance - pendingOrders`.
Rules: order HELD if credit available too low, account BLOCKED/ON_HOLD, or overdue beyond allowed days; cannot be RELEASED unless paid or within approved credit; price changes only affect new orders; post-approval changes need reason (+second approval above a limit); cancelled orders free credit and stock; released orders **reserve stock** (bags in FG-WH, MT in silo for bulk); payment allocation oldest invoice first (or named); overpayment -> prepaid credit; cheques held pending until cleared; duplicate payment references rejected; confirmer of payment != approver of credit (enforced in M8 RBAC, modelled now); held order auto-released when payment clears it; commission per delivered and paid tonne/bag.
Endpoints: `/api/price-lists`, `/api/orders` (+ `submit/approve/hold/release/cancel`), `/api/orders/credit-check`, `/api/invoices`, `/api/payments` (+ `confirm`), `/api/parties/{id}/ledger|statement`, `/api/commissions`.
UI `/orders`: order wizard with live credit gauge (animated), approval queue, payment flow stepper (Started -> Pending -> Confirmed -> Allocated -> Receipt -> Released), account ledger/statement view with ageing, sample from PDF Appendix C.
Acceptance (PDF 7.4): limit 100,000; balance 20,000; pending 15,000 -> available 65,000; order 70,000 HELD, order 60,000 APPROVED. Statement from Appendix C closes at 7,350.

### M6 - Outbound weighbridge, gate and loading (PDF 10.6-10.10, 11)  <- the signature feature
Entities: `GateEvent` (arrival, check, queued, bay, exit, user), `LoadingTicket` (`LT-yyyymmdd-nnnn`, order, truck, driver, bay, bagsLoaded, pallets, seal, batchCodes, times, variance, status ISSUED/LOADING/LOADED/DISPATCHED/DELIVERED), `Dispatch` (created at gate-out), reuse M4 `WeighbridgeTicket/WeightEvent` with direction OUT (first = tare, second = gross).
Flow: Release -> arrival check -> queue/bay -> tare weigh-in (ticket Open) -> loading (FIFO pallets / silo spout) -> loading confirmed -> gross weigh-out -> checks -> ticket Completed -> papers -> gate-out -> stock deducted -> dispatch record -> notification.
Rules (all from PDF 10.7-10.10, 11.5):
- Truck cannot be queued/weighed unless order is RELEASED; vehicle registered and not blocked; driver valid.
- Only stable readings; tare compared with the vehicle's stored tare (drift beyond tolerance flagged); operator sees weight only, supervisor sees expected/variance.
- Expected net = bags x 50 kg + pallets x pallet weight; variance beyond tolerance -> recount or unload and **reweigh** (every reweigh kept, never overwritten).
- Overload vs vehicle capacity or gross limit blocks gate-out.
- Loading blocked for batches not QC-released; pallets issued FIFO by batch; bulk needs clean/dry tanker check and seal numbers.
- Gate-out opens only if ticket COMPLETED, order LOADED, no hold, and ticket number + plate + driver + seal match; otherwise stays shut and supervisor alerted.
- Stock deducted only after gross weight exists: bagged -> FG-WH bags; bulk -> silo MT by net weight; partial loads close the line with quantity loaded.
- Invoice basis: bagged = bag count (weight is control); bulk = net weight (confirm with client; configurable).
- Weighbridge operator and loading supervisor must be different users; operator cannot edit a completed ticket (RBAC in M8).
- Offline: console state lives in an edge-server queue and syncs later (design here, harden in M9).
Endpoints: `/api/gate/arrivals`, `/api/gate/{id}/check|queue|exit`, `/api/loading/tickets` (+ `confirm`), `/api/weighbridge/tickets` (outbound modes), `/api/dispatches`.
UI `/weighbridge`: **3D live truck lane** (gate -> scale (tare) -> bay -> scale (gross) -> exit, barrier animation, traffic light), three role consoles (weighbridge, gate, loading) with big buttons, exceptions panel (overload, tare drift, variance), printable ticket view with QR.
Acceptance (PDF 10.8 numbers): 400 bags 42.5R = 10 pallets; tare 14,200, gross 34,380, net 20,180 kg vs expected 20,150 (+30 kg, 0.15%) passes at 0.5% tolerance; FG-WH -400 bags. Bulk 30 MT: tare 15,100, gross 45,160, net 30,060 kg, silo -30.06 MT, invoiced 30.06 MT. Overload test blocks exit.

### M7 - Distributor portal, delivery and notifications (PDF 7, 12)
Entities: `PortalUser` (phone/PIN or password, role DISTRIBUTOR/AGENT/DRIVER, party link), `SubClient`, `Notification` (recipient, channel SMS/APP/EMAIL, template, status), `DeliveryEvent` (dispatched, on-road locations, arrived, delivered, exception), `ProofOfDelivery` (receiver, signature, photo ref, time, location, receivedQty), delivery exception -> credit note request (M5).
Rules: users see only their own account (agents also linked clients); sign-in limits, optional 2FA for payments; actions logged; staff acting for a distributor identified in the log; notifications at each order stage (submitted, approved/held, payment received, released, at gate/loaded, dispatched with net weight and ticket no., delivered, payment due/overdue) via a provider interface (log provider now, SMS later); proof of delivery closes the invoice.
Endpoints: `/api/portal/*` (own orders, balance, statement PDF/CSV, pay, track, price list, trucks/drivers), `/api/driver/pod`, `/api/notifications`.
UI `/portal` (own layout): sign-in, dashboard (balance, credit available), quick re-order, order tracking with animated progress and map/route, payment screen, statements, driver POD page (signature canvas). Responsive/mobile-first.

### M8 - Dashboards, reports, roles and audit (PDF 16, 17, 21)
- Spring Security + JWT; roles from PDF 16.1: ADMIN, GENERAL_MANAGER, FINANCE_MANAGER, ACCOUNTANT, CASHIER, PROCUREMENT, STORE_MANAGER, STOREKEEPER, PRODUCTION_SUPERVISOR, QUALITY_OFFICER, SALES_OFFICER, CREDIT_CONTROLLER, WEIGHBRIDGE_OPERATOR, GATE_OFFICER, LOADING_SUPERVISOR, DISPATCHER, DISTRIBUTOR, AGENT.
- Segregation of duties (PDF 16.1): issuer != receiver; PO creator != payment approver; payment confirmer != credit approver; weighbridge operator cannot edit completed ticket; nobody approves own override.
- Audit: `AuditLog` (who, when, entity, action, old/new values for master data: price, credit limit, recipe, vehicle tare); daily **exceptions report** (voids, overrides, manual/reweighed tickets, manual journals, stock adjustments).
- Reports (PDF 17): stock by store/lot, silo reconciliation, production vs recipe, yield and losses, purchasing, sales by grade/region/agent, payments and ageing, weighbridge (ordered vs loaded vs weighed, tare drift, overload blocks, gate-outs without completed ticket = 0), delivery, finance; all export CSV/PDF.
- UI: executive dashboard (animated KPIs, 3D plant live: silo levels, trucks in plant, queue), exceptions center, report explorer.

### M9 - Hardening and deployment (PDF 15, 19, 20)
Locking/optimistic versioning on stock and credit; Dockerfile + docker-compose (Postgres, backend, frontend); GitHub Actions CI (`mvn test`, `next build`); Playwright e2e for the end-to-end scenario; edge-server/offline sync for gate and weighbridge; performance pass; backup/restore notes; security review checklist (PDF 15.1 points); final docs.

### Optional later (PDF 13)
Plant data capture (silo level sensors, bag counters, belt scales), mobile apps, payment-provider integration (mobile money), plate recognition, own-kiln support (limestone/clay/kiln step).

---------------------------------------------------------------------------------------------------

## 6. Document numbers and statuses (PDF Appendix B)

| Document | Format | Statuses |
|---|---|---|
| Purchase order | `PO-yyyymmdd-nnn` | Draft, Approved, Part received, Received, Closed, Cancelled |
| Goods receipt | `GRN-yyyymmdd-nnn` | Draft, Quality hold, Approved, Posted |
| Transfer | `TRF-yyyymmdd-nnn` | Draft, Approved, Issued, Received, Cancelled |
| Grinding run | `PROD-yyyymmdd-nnn` | Planned, In progress, Awaiting QC, Completed, Cancelled |
| Bagging run | `BAG-yyyymmdd-nnn` | same as grinding |
| Pallet | `PL-yyyymmdd-nnnnn` | In warehouse, Reserved, Loaded, Held, Quarantine |
| Leftover return | `RET-yyyymmdd-nnn` | Draft, Returned, Received, Cancelled |
| Sales order | `SO-yyyymmdd-nnn` | Draft, Submitted, Held, Approved, Released, Part loaded, Loaded, Delivered, Closed, Cancelled |
| Payment / Receipt | `PAY-...-nnnn` / `RC-...-nnnn` | Started, Pending, Confirmed, Allocated, Failed, Refunded / Issued, Cancelled |
| Weighbridge ticket | `WB-yyyymmdd-nnnn` | Open, Completed, Voided, Overridden |
| Loading ticket | `LT-yyyymmdd-nnnn` | Issued, Loading, Loaded, Dispatched, Delivered |
| Delivery note | `DN-yyyymmdd-nnnn` | Printed, Dispatched, Delivered, Disputed |
| Credit note | `CN-yyyymmdd-nnn` | Draft, Approved, Applied |

Implement numbering with a `DocumentSequence` helper (per prefix per day, zero-padded) - create it the first time a milestone needs it (M3) and reuse everywhere.

---------------------------------------------------------------------------------------------------

## 7. Consolidated business-rule catalogue (check each is implemented and tested)

| ID | Rule | PDF | Milestone | Status |
|---|---|---|---|---|
| R01 | Balances are In - Out from the ledger, never stored | 3.7 | M2 | done |
| R02 | Stock cannot go negative | 3.7 | M2 | done |
| R03 | A silo holds one grade only | 3.3 | M2 | done |
| R04 | Stores respect capacity | 3.1 | M2 | done |
| R05 | Adjustments need reason code; large ones need approval | 4.2 | M2 | done |
| R06 | Units convert through kg (1 pallet = 40 bags = 2 MT) | 3.4 | M1 | done |
| R07 | Production blocked with a clear shortage message if materials short | 3.7 | M3 | todo |
| R08 | Grinding consumes from MFG-ROOM; leftover must be returned before run closes | 14.2/14.3 | M3 | todo |
| R09 | Output vs recipe yield variance flagged | 14.2 | M3 | todo |
| R10 | Unreleased/held batches cannot be sold or loaded | 4.8, 11.5 | M3, M6 | todo |
| R11 | Pallet = 40 bags; each pallet has a batch code linking run + silo lot | 14.2 | M3 | todo |
| R12 | Receipt posts by weighbridge **net** weight | 9.2/10.2 | M4 | todo |
| R13 | Only stable weights; manual weights need 2nd approval and are flagged | 10.10 | M4/M6 | todo |
| R14 | Completed ticket immutable; corrections by supervisor with trail | 10.10, 16.1 | M4/M8 | todo |
| R15 | Imported consignment: sum of truck nets vs bill of lading | 10.5 | M4 | todo |
| R16 | Credit available = limit - balance - pending orders; hold when too low/blocked/overdue | 7.4, 8.4 | M5 | todo |
| R17 | Order cannot be released unless paid or within approved credit | 8.4 | M5 | todo |
| R18 | Payment allocated oldest-first; overpayment is prepaid credit; duplicate refs rejected | 9.3 | M5 | todo |
| R19 | Cheques pending until cleared | 9.1 | M5 | todo |
| R20 | Released orders reserve stock | 8.4 | M5/M6 | todo |
| R21 | Truck cannot be queued/weighed unless order Released | 11.5 | M6 | todo |
| R22 | Tare drift vs stored tare flagged | 10.10 | M6 | todo |
| R23 | Expected net = bags x 50 kg + pallets; variance beyond tolerance -> recount/reweigh, all weights kept | 10.7 | M6 | todo |
| R24 | Overload blocks gate-out | 10.10 | M6 | todo |
| R25 | Gate-out only with Completed ticket, matching plate/driver/seal | 10.7 | M6 | todo |
| R26 | Stock deducted only after gross weight exists; pallets FIFO | 10.7, 11.3 | M6 | todo |
| R27 | Portal users see only their own data | 7.2 | M7 | todo |
| R28 | Notifications at each order stage | 7.8 | M7 | todo |
| R29 | Segregation of duties and audit trail | 16 | M8 | todo |
| R30 | Gate and weighbridge work offline and sync | 5.1, 19 | M6/M9 | todo |

Update the Status column whenever a rule lands (and the checkbox list in `docs/MILESTONES.md`).

---------------------------------------------------------------------------------------------------

## 8. Data model overview (target)

```
Unit, Item, Party(+agent), Vehicle, Driver                      (M1)
Store, Lot, StockMovement                                        (M2)
Recipe/RecipeLine, ProductionRun/RunLine, Pallet, QualityResult, LeftoverReturn   (M3)
PurchaseOrder/Line, GoodsReceipt, SupplierInvoice/Payment, WeighbridgeTicket/WeightEvent   (M4)
PriceList/Line, SalesOrder/Line, Invoice, Payment/Allocation, Receipt, CreditNote, LedgerLine, AgentCommission   (M5)
GateEvent, LoadingTicket, Dispatch                               (M6)
PortalUser, Notification, DeliveryEvent, ProofOfDelivery         (M7)
User/Role, AuditLog                                              (M8)
```
Links: Party <-> Orders/Invoices/Payments/Ledger; Order -> LoadingTicket -> WeighbridgeTicket -> StockMovement (dispatch) -> Dispatch -> ProofOfDelivery;
ProductionRun -> StockMovements + Pallets; GRN -> WeighbridgeTicket (inbound) -> StockMovement (receipt); Pallet.batchCode <-> QualityResult.

---------------------------------------------------------------------------------------------------

## 9. End-to-end acceptance scenario (build it as an automated test by M9)

1. Opening: RAW-YARD clinker 300 MT, gypsum 8 MT (below reorder -> alert). Buy 30 MT gypsum (PO) -> inbound truck net 30.06 MT -> GRN -> gypsum 38.06 MT.
2. Transfer 95 MT clinker + 5 MT gypsum to MFG-ROOM; grinding run 100 MT of 42.5R -> silo 42.5R +100 MT; yield within tolerance.
3. QC releases silo lot; bagging run 50 MT -> 1,000 bags on 25 pallets in FG-WH.
4. Distributor (limit 100,000; balance 20,000) orders 400 bags; approved; pays by mobile money; invoice; order RELEASED; stock reserved.
5. Truck GT-1234-24 arrives; gate check passes; tare 14,200 kg; loads 10 pallets FIFO; gross 34,380 kg; net 20,180 kg vs expected 20,150 (+0.15%, pass); ticket Completed; gate-out opens; FG-WH -400 bags; dispatch notice with net weight sent.
6. Driver records proof of delivery; invoice closed; statement shows payment and balance; exceptions report empty.

---------------------------------------------------------------------------------------------------

## 10. Open questions (ask the client before hard-coding)
Own kiln or bought clinker; products at launch; recipes incl. 42.5N and variance; silo count/capacity/level measurement; bag-count vs net-weight invoicing and tolerance; pallet weight and returns; weighbridges count; payment providers and fees; commission rules; hosting. (PDF 21.3)
