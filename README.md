# Cement Factory System

A cement manufacturing and distribution platform in the spirit of iProduction, extended with
distributor ordering, payments, inbound and outbound weighbridge, gate and loading, delivery tracking,
and a 3D plant visualisation. Designed from `docs/Cement_Operations_System_on_iProduction_v0.4.pdf`.

## Stack
- **Backend:** Java 21, Spring Boot 3, MVC layers (controller, service, repository, model, dto)
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, React Three Fiber (3D)
- **Database:** H2 for local development, PostgreSQL for production

## Layout
```
backend/    Spring Boot application (MVC)
frontend/   Next.js application
docs/       Specification PDF and milestone plan
```

## Run
```bash
# backend (needs Maven and Java 21)
cd backend && mvn spring-boot:run        # http://localhost:8080/api/health

# frontend
cd frontend && npm install && npm run dev  # http://localhost:3000
```

See `docs/MILESTONES.md` for the build plan and progress.
