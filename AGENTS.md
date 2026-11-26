# Agent guide - Cement Factory System

Read this first, then `docs/HANDOFF.md` (status + next task) and `docs/MILESTONES.md` (plan).
The functional spec is `docs/Cement_Operations_System_on_iProduction_v0.4.pdf`; milestone rows cite its section numbers.

## Stack and layout
- `backend/` Java 21, Spring Boot 3.3, Spring MVC, JPA. Package `com.cementfactory`.
- `frontend/` Next.js 16 (App Router), React 19, Tailwind 4, Framer Motion 12+, React Three Fiber 9 + drei, lucide-react.

## Backend conventions (MVC)
- Layers: `controller` (thin REST, `@Valid` DTOs) -> `service` (all business rules, `@Transactional`) -> `repository` (Spring Data) -> `model` (JPA entities extend `BaseEntity`).
- Controllers never return entities. Use `dto` records with a static `from(entity)`; requests and responses may share one record.
- Errors: throw `NotFoundException` (404) or `BusinessRuleException` (422, message shown to users). Validation errors are 400 via `GlobalExceptionHandler`.
- Stock is a ledger (`StockMovement`). Never store balances; sum POSTED movements. Quantities are in each item's base unit (MT, BAG, ...); convert with kg factors of `UnitOfMeasure`.
- Seeders (`config/`) use `@Order`: `DataSeeder`(1) master data, `StockSeeder`(2) stores and opening stock. New seeders should run after these.
- Code strings (item, party, store, vehicle) are upper-cased and unique. Document numbers follow PDF Appendix B (`SO-yyyymmdd-nnn`, `WB-...`, `LT-...`).
- Tests: `@SpringBootTest` + MockMvc, in-memory H2 via `src/test/resources/application.yml`. Tests share one DB per run, so assert on status codes/messages or on before/after deltas, not absolute totals.

## Frontend conventions
- One folder per module in `src/app/<module>/page.tsx` ("use client"). Shared UI in `src/components`, API/typing helpers in `src/lib`.
- Data loading: `useList<T>(path, SAMPLE_DATA)` returns live API data, or sample data with `live=false` when the backend is offline. Every page must keep working offline (banner + disabled write actions). Add matching sample data to `src/lib/sample.ts` and types to `src/lib/types.ts`.
- 3D: React Three Fiber scenes must be `"use client"` and loaded through a `dynamic(..., { ssr: false })` wrapper (see `PlantSceneLoader`). No external assets/HDRs/fonts (sandboxes block CDNs): use primitives, lights and drei `Html` labels. `next/font/google` is not used.
- Style: dark industrial theme in `globals.css` (`.glass`, `.glow-text`, colours `teal`, `glow`, `amber`, `muted`). Animate with Framer Motion (stagger on lists, `layoutId` tabs, count-up numbers).
- Mark a milestone live by adding its number to `COMPLETED_MILESTONES` in `src/lib/modules.ts`.
- API base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`). Backend CORS allows `http://localhost:3000`.

## Definition of done for a milestone
1. Backend entities/services/controllers + tests + seed data where useful. 2. Frontend page(s) with animation/3D, offline sample data.
3. `cd frontend && npx next build` passes; `cd backend && mvn test` passes (if Maven is available).
4. Update `docs/MILESTONES.md` progress + `docs/HANDOFF.md`; commit as `Mx: <summary>`; push to `main`.

## Do not
- Do not commit secrets or tokens. Do not store balances. Do not put business rules in controllers or React components.
