# MedFlow OPD — Master System Audit

**Audit date:** 2026-05-15  
**Repository:** `c:\node-projects\opd-system`  
**Method:** Source-code verification (backend `src/`, frontend `app/` + `views/`, `backend/prisma/schema.prisma`). Prior MD sprint reports treated as **claims only** unless re-verified.  
**Audience:** Agents and engineers with zero prior context.

---

## Executive summary

MedFlow OPD is a **NestJS + Prisma + PostgreSQL** backend and **Next.js (App Router, basePath `/opd`)** frontend for clinic operations. The system has a **real clinical spine** (patient → case → queue → consultation → billing → pharmacy/lab) but is **not production-ready as a whole**. Reception operational flows, doctor consultation workspace, pharmacy, and laboratory modules are **partially connected**. Admin, medical (legacy pharmacy), auth recovery, public waiting screen, and large parts of nursing/doctor ancillary screens are **UI shells or static data**. The database schema is **enterprise-sized (76 models)** while application code actively uses **~43 models**; ~33 models are **schema-only dead weight** today.

**Single largest risks:** unauthenticated SSE; `req.user.userId` vs `req.user.id` bug on billing/consent/pharmacy/lab; JWT default secret; nested/non-atomic transactions; mock file URLs for uploads.

---

## 1. System topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Next.js Frontend (basePath /opd)                                       │
│  app/*/page.tsx → views/* (thin wrappers)                               │
│  lib/api.ts (Axios + JWT from localStorage)                             │
│  middleware.ts (cookie token + role prefix guard)                       │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ REST /api/*
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  NestJS Backend (global prefix api, ValidationPipe)                     │
│  Modules: Auth, Users, Doctors, Staff, Patients, Queue, Billing,      │
│  Common(Events+FileStorage), Consultation, Appointments, Consent,       │
│  Pharmacy, Laboratory                                                    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ Prisma
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PostgreSQL — 76 Prisma models, 18 enums                                │
└─────────────────────────────────────────────────────────────────────────┘

SSE (in-memory RxJS, NO AUTH):
  GET /api/events/queue
  GET /api/events/clinical
```

---

## 2. What exists (inventory)

### 2.1 Backend modules (verified `backend/src/app.module.ts`)

| Module | Controller | Service | Exported |
|--------|------------|---------|----------|
| Auth | `auth.controller.ts` | `auth.service.ts` | AuthService |
| Users | `users.controller.ts` | `users.service.ts` | UsersService |
| Doctors | `doctors.controller.ts` | `doctors.service.ts` | — |
| Staff | `staff.controller.ts` | `staff.service.ts` | — |
| Patients | `patients.controller.ts` | `patients.service.ts` | PatientsService |
| Queue | `queue.controller.ts` | `queue.service.ts` | QueueService |
| Billing | `billing.controller.ts` | `billing.service.ts` | BillingService |
| Common | `events.controller.ts` | `events.service.ts`, `file-storage.service.ts` | Both (@Global) |
| Consultation | `consultation.controller.ts` | `consultation.service.ts` | — |
| Appointments | `appointments.controller.ts` | `appointments.service.ts` | AppointmentsService |
| Consent | `consent.controller.ts` | `consent.service.ts` | — |
| Pharmacy | `pharmacy.controller.ts` | `pharmacy.service.ts` | PharmacyService |
| Laboratory | `laboratory.controller.ts` | `laboratory.service.ts` | LaboratoryService |

**Not present as modules:** dedicated Reports, Notifications, Admin CRUD for masters (drugs/lab/procedures), Follow-up, OTP, Device auth, Clinic/Branch management — despite models existing in schema.

### 2.2 Frontend route inventory (55 `app/**/page.tsx` files)

| Role | Routed pages | Primary view |
|------|--------------|--------------|
| **Public** | `/`, `/login`, `/forgot-password`, `/reset-password`, `/waiting-screen` | Auth + static TV queue |
| **Reception** | dashboard, register, search, appointments, queue, checkin, billing, consent, lab, lab-upload, profile×2, patients/[id] | `views/reception/*` |
| **Doctor** | dashboard, consultation (broken redirect), consultation/[caseId], followup-call-list, billing-view | `views/doctor/*` |
| **Nursing** | dashboard, vitals, lab-reports, followup, profile | `views/nursing/*` |
| **Pharmacy** | queue, inventory, dispense/[caseId] | `views/pharmacy/*` |
| **Laboratory** | pending, process/[orderId] | `views/laboratory/*` |
| **Medical (legacy)** | dashboard, dispensing, stock, profile | `views/medical/*` — static |
| **Admin** | dashboard, patients, appointments, doctors±add/edit, staff±add/edit, billing, drugs, lab, procedures, notifications, reports, settings, support, profile | Mostly static except doctors/staff |

**Orphan views (no `app/` route):** `views/reception/waiting-display/page.tsx` (real API+SSE), `views/print/*` (print layouts).

### 2.3 Database (Prisma)

- **76 models**, **18 enums** in `backend/prisma/schema.prisma`
- Seed script: `backend/prisma/seed.ts` (users, patients, cases, lab masters, procedures)
- Alternate design docs in `db_doc/` (NOT applied as runtime schema)

### 2.4 Hooks and shared frontend infrastructure

| Asset | Path | Status |
|-------|------|--------|
| API client | `frontend/lib/api.ts` | Real Axios; JWT interceptor; 401 → login |
| Queue SSE | `frontend/hooks/useQueueSSE.ts` | Real; refreshes `/queue/live`, `/queue/stats` |
| Clinical SSE | `frontend/hooks/useClinicalSSE.ts` | Real; token query param |
| Consultation state | `views/doctor/consultation/hooks/useConsultation.ts` | Real save/load |
| Route constants | `frontend/constants/routes.ts` | Partially adopted |
| Zustand/other stores | — | **None found** |

### 2.5 Documentation artifacts (repo root + db_doc)

| File | Role |
|------|------|
| `SYSTEM_WORKFLOW_MASTER.md` | Aspirational FRD-style workflows (many unimplemented) |
| `RECEPTION_*.md` (7 files) | Reception audits; **partially outdated** |
| `db_doc/*.md` | Schema evolution / migration planning |
| `documentation1.md`, `documentation2.md` | Legacy docs |
| `PROJECT_RULES.md`, `STACK.md` | Conventions |

---

## 3. What is real (verified end-to-end)

| Capability | Frontend | Backend | DB |
|------------|----------|---------|-----|
| Login + JWT | `views/auth/login/page.tsx` | `POST /auth/login` | User |
| Patient register/search | reception register/search | `POST/GET /patients/*` | Patient, PatientProfile |
| Patient hub + vitals + case start | hub views | patients service | PatientCase, PatientVitals |
| OPD queue check-in/status | opd-queue, check-in | `POST /queue/check-in`, PATCH status | QueueEntry, QueueHistory |
| Queue SSE refresh | useQueueSSE consumers | `GET /events/queue` | — |
| Appointments book + slots | appointments/book | `GET /appointments/slots`, `POST /appointments` | Appointment, DoctorSchedule |
| Appointment check-in | check-in page | `POST /appointments/check-in` | Appointment + queue |
| Billing create/pay/split/FOC | billing page | `POST /billing`, `POST /billing/:id/pay` | Bill, BillItem, BillPayment |
| Consent templates + save | consent-form | `GET/POST /consent/*` | ConsentTemplate, ConsentForm |
| Doctor consultation tabs | consultation/[caseId] | `GET/POST /consultation/:caseId/*` | ConsultationRecord + related |
| Consultation finalize | FinalReportTab | `POST .../finalize` | Case stage updates |
| Pharmacy queue/dispense/inventory | pharmacy views | `/pharmacy/*` | Prescription, DrugInventory |
| Lab pending/process/results | laboratory views | `/laboratory/*` | InvestigationOrder, InvestigationResult |
| Admin doctors/staff CRUD | admin doctors/staff | `/doctors`, `/staff` | User + profiles |
| Nursing vitals | nursing/vitals | `POST /patients/:id/vitals` | PatientVitals + clinical SSE |

---

## 4. What is fake / static / UI-only

See `STATIC_VS_DYNAMIC_AUDIT.md` for the full table. Summary:

- **Admin module** (except doctors/staff): in-memory arrays, chart placeholders, no API
- **Medical module**: entire parallel pharmacy UI with static inventory
- **Auth recovery**: forgot/reset password simulated with `setTimeout`
- **Public waiting-screen**: hardcoded queue array
- **File uploads** (reception lab-upload, nursing lab-reports, doctor ImagesTab): mock URLs, not multipart storage
- **Doctor** follow-up list, billing-view: static tables
- **Nursing** follow-up: static
- **Sidebar personas**: hardcoded names ("Jane Doe", "Dr. Sameer Khan")
- **Backend file hash**: dummy SHA in `file-storage.service.ts`

---

## 5. What is partially implemented

| Area | Done | Missing |
|------|------|---------|
| Reception | Core loop | Profile save; real uploads; waiting-display route; duplicate routes |
| Appointments | Book + slots API | No role guard on backend; SMS/WhatsApp; holiday enforcement weak |
| Billing | Split + FOC | `createdById` broken (`userId` bug); bill number race; no amount validation |
| Consultation | 7-tab workspace | `POST .../save` body untyped; image upload fake URL; nested billing tx |
| Consent | DB save | No signature capture; no PDF generation |
| Pharmacy | Dispense + inventory | No SSE; missing dashboard/history pages |
| Laboratory | Results entry | Collect sample button unwired; missing nav pages |
| SSE | Queue + clinical streams | No auth; billing events not exposed; pharmacy not subscribed |
| RBAC | Per-route decorators | Gaps on queue/billing reads, appointments module, public SSE |
| Schema | 76 models | 33 unused; duplicate status fields (string + enum) |

---

## 6. What is broken

| Issue | Location | Impact |
|-------|----------|--------|
| `req.user.userId` undefined | `billing.controller.ts`, `consent.controller.ts`, `pharmacy.controller.ts`, `laboratory.controller.ts` | Audit fields / createdBy wrong or null |
| Doctor consultation redirect | `app/doctor/consultation/page.tsx` → deleted `/complaints` route | 404 after navigation |
| `ROLE_REDIRECT_MAP` missing PHARMACY, LABORATORY | `constants/routes.ts` | Post-login redirect to `/` |
| Dual token storage | cookies (middleware) + localStorage (api) | Inconsistent auth state |
| `emitBillingUpdate` no HTTP endpoint | `events.service.ts` | Frontend cannot subscribe to billing SSE |
| Nested `$transaction` across services | appointments check-in, consultation+billing | Partial commits possible |
| Login role "Admin" → ADMIN | works if backend uses ADMIN | Fragile naming |

---

## 7. What is not connected

| UI | Expected backend | Actual |
|----|------------------|--------|
| Admin drugs/lab/procedures/patients | CRUD masters | No controllers |
| Admin dashboard/reports charts | Analytics API | Placeholder divs |
| Medical dispensing/stock | `/pharmacy/*` | No API calls |
| Forgot/reset password | Auth OTP/reset | Simulated timeout |
| Print views | Routed print pages | No `app/print/*` routes |
| Doctor sidebar links (queue, appointments, pharmacy, reports, profile) | Various | No pages |
| Pharmacy/Lab layout nav (dashboard, catalog, history) | — | No pages |
| `SYSTEM_WORKFLOW_MASTER` OTP device lock, SMS, mobile masking | — | Not implemented |
| 33 Prisma models | Feature services | Zero references |

---

## 8. Architecture doc violations

| Document claim | Code reality |
|----------------|--------------|
| `SYSTEM_WORKFLOW_MASTER.md`: Strict RBAC everywhere | Queue/billing reads unscoped; appointments JWT-only; SSE public |
| Same: OTP for profile edits | Not implemented |
| Same: Device-authorized login only | Not implemented |
| Same: Mobile masking in lists | Not verified in list components |
| `RECEPTION_PRODUCTION_READINESS.md`: Appointments "completely static" | **FALSE** — `appointments/book` uses live API |
| Same: Billing missing split/FOC | **FALSE** — implemented (`pay-bill.dto.ts`, billing page) |
| Same: Consent/lab "mock UI only" | **PARTIAL** — consent API real; uploads use mock URLs |
| `db_doc/MASTER_DATABASE_ARCHITECTURE.md` | Aspirational; live schema differs in usage |
| `RECEPTION_IMPLEMENTATION_REPORT.md` "Completed" | Means planning docs written, not full dynamic conversion |

---

## 9. Production readiness by module

| Module | Verdict | Rationale |
|--------|---------|-----------|
| Auth (login) | **STAGING** | Works; default JWT secret; no refresh tokens |
| Reception core | **STAGING** | Queue/register/check-in/billing connected; uploads/profile gaps |
| Appointments | **STAGING** | API exists; weak authorization |
| Doctor consultation | **STAGING** | Strong UI; upload + tx + save DTO gaps |
| Nursing vitals | **STAGING** | API connected |
| Nursing lab/follow-up | **NOT READY** | Mock uploads / static follow-up |
| Pharmacy | **STAGING** | API connected; nav gaps; no SSE |
| Laboratory | **STAGING** | Core flow works; sample collection unwired |
| Billing | **STAGING** | Functional; race conditions + userId bug |
| Admin | **NOT READY** | Mostly prototype UI |
| Medical (legacy) | **NOT READY** | Static; superseded by pharmacy |
| Public waiting screen | **NOT READY** | Static data |
| SSE layer | **NOT READY** | No authentication |
| File storage | **NOT READY** | Dummy hashes, local disk |

**Overall system:** **NOT PRODUCTION READY** without security hardening, upload pipeline, admin masters APIs, and documentation-driven features (OTP, notifications, multi-branch).

---

## 10. What is dangerous (P0)

1. **Unauthenticated SSE** — live queue and clinical events leakable (`events.controller.ts`).
2. **JWT secret fallback** — `jwt.strategy.ts` default string if env missing.
3. **CORS default allow-all** — `main.ts`.
4. **`req.user.userId` bug** — breaks audit trail on payments/consent/pharmacy/lab.
5. **Bill number / token generation races** — concurrent check-ins or bills.
6. **Nested transactions** — appointment+queue, consultation+billing not atomic.
7. **Mock file URLs persisted** — false evidence of uploaded reports/images.
8. **RolesGuard passes when `@Roles` omitted** — any authenticated user on several queue/billing routes.
9. **Appointments: any role can book** — no `RolesGuard`.
10. **Pharmacy stock decrement** — no row locking/idempotency.

---

## 11. Cross-reference index

| Audit file | Contents |
|------------|----------|
| `STATIC_VS_DYNAMIC_AUDIT.md` | Every mock/static element with file + severity |
| `IMPLEMENTATION_STATUS_MATRIX.md` | Per-module UI/Backend/DB/SSE matrix |
| `WORKFLOW_VALIDATION_AUDIT.md` | 12 workflows step-by-step |
| `DOCUMENTATION_COMPLIANCE_AUDIT.md` | Claims vs code |
| `SECURITY_PRODUCTION_AUDIT.md` | RBAC, auth, tx, validation |
| `UI_UX_AUDIT.md` | Layout, responsiveness, design debt |
| `DATABASE_ARCHITECTURE_AUDIT.md` | Schema smell, unused models |
| `PERFORMANCE_AUDIT.md` | Rerenders, N+1, SSE leaks |
| `FINAL_IMPLEMENTATION_ROADMAP.md` | Phased plan (20+ phases) |

---

## 12. Verified API surface (backend)

Global prefix: `/api`

**Public (no JWT):** `GET /`, `POST /auth/login`, `GET /events/queue`, `GET /events/clinical`

**Authenticated modules:** See subagent route tables in this audit's source exploration; full enumeration in `WORKFLOW_VALIDATION_AUDIT.md` appendix.

**Dead backend capabilities:** No HTTP routes for: Clinic/Branch, Notifications, Follow-up, OTP, Device auth, Admin master CRUD (drugs/lab beyond consultation read), Reports/Analytics, `UserSession` management.

---

*This document is the top-level map. All completion claims below module level must be verified in the linked audit files before release.*
