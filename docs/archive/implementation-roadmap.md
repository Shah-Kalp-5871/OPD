# Final Implementation Roadmap — MedFlow OPD

**Purpose:** Single execution plan for agents/engineers to finish the system.  
**Prerequisite reading:** `MASTER_SYSTEM_AUDIT.md`, `IMPLEMENTATION_STATUS_MATRIX.md`, `SECURITY_PRODUCTION_AUDIT.md`  
**Rule:** Do not mark a phase complete until code + manual happy-path verified.

**Complexity:** S (days) · M (1–2 weeks) · L (2–4 weeks) · XL (month+)

---

## Phase overview map

```
P1 Security hotfix ──► P2 Auth consistency ──► P3 File uploads
        │                      │                    │
        └──────────► P4 Billing hardening ◄────────┘
                           │
        P5 Appointments RBAC ──► P6 Reception polish
                           │
        P7 Consultation hardening ──► P8 Print routes
                           │
        P9 Admin masters API ──► P10 Admin UI wire-up
                           │
        P11 Laboratory complete ──► P12 Pharmacy SSE
                           │
        P13 Nursing/follow-up ──► P14 Doctor ancillary
                           │
        P15 Auth recovery ──► P16 Public waiting screen
                           │
        P17 Deprecate medical module ──► P18 Multi-branch (optional)
                           │
        P19 Schema cleanup ──► P20 Observability & load test
                           │
        P21+ Enterprise features (OTP, notifications, analytics)
```

---

## PHASE 1 — Security hotfix (P0)

| Field | Value |
|-------|-------|
| **Objective** | Close critical production blockers |
| **Priority** | P0 — deploy blocker |
| **Complexity** | S |
| **Dependencies** | None |

### Backend tasks
- Remove JWT default secret; throw if `JWT_SECRET` missing (`jwt.strategy.ts`, `auth.module.ts`)
- Add `@UseGuards(JwtAuthGuard)` to `EventsController` + stream token validation (`events.controller.ts`, `events.service.ts`)
- Fix `req.user.userId` → `req.user.id` in: `billing.controller.ts`, `consent.controller.ts`, `pharmacy.controller.ts`, `laboratory.controller.ts`
- Add `@Roles` to: `queue.controller.ts` (live/stats/status), `billing.controller.ts` (GET routes), entire `appointments.controller.ts` + `RolesGuard`
- Restrict CORS in `main.ts` to frontend origin

### Frontend tasks
- Pass JWT to EventSource (`useQueueSSE.ts`, `useClinicalSSE.ts`) — query or cookie strategy matching backend
- Add `PHARMACY`, `LAB_TECHNICIAN` to `ROLE_REDIRECT_MAP` (`constants/routes.ts`)

### DB tasks
- None

### Security tasks
- All above

### Testing tasks
- Attempt SSE without token → 401
- Pay bill → verify `createdById` populated
- Login as NURSING → appointments POST → 403

### Blockers
- None

---

## PHASE 2 — Auth storage consistency

| Field | Value |
|-------|-------|
| **Objective** | Single auth source of truth |
| **Priority** | P0 |
| **Complexity** | S |
| **Dependencies** | Phase 1 |

### Backend
- Optional: `POST /auth/logout` invalidate session if `UserSession` implemented later

### Frontend
- Unify token: prefer httpOnly cookie set by login OR sync cookie + localStorage (`login/page.tsx`, `lib/api.ts`, `middleware.ts`)
- Add `/forgot-password`, `/reset-password` to middleware public list or auth flow

### Testing
- Refresh page on reception route — still authenticated
- 401 clears both storages

---

## PHASE 3 — Real file upload pipeline

| Field | Value |
|-------|-------|
| **Objective** | Replace all mock file URLs |
| **Priority** | P0 |
| **Complexity** | M |
| **Dependencies** | Phase 1 |

### Backend
- `file-storage.service.ts`: multipart, real SHA-256, size/MIME allowlist
- `POST /upload` or per-domain upload endpoints with JWT
- Serve files via guarded route or signed URLs
- `consultation.controller.ts`: accept multipart for images + investigation upload
- Wire `InvestigationFile`, `ClinicalImage` with real paths

### Frontend
- `reception/lab-upload/page.tsx`: FormData upload
- `nursing/lab-reports/page.tsx`: same
- `doctor/.../ImagesTab.tsx`: remove Unsplash dummy

### DB
- Verify `InvestigationFile`, `ClinicalImage` fields sufficient

### Testing
- Upload PDF/image → DB URL accessible only when authenticated

### Blockers
- Storage decision (local vs S3)

---

## PHASE 4 — Billing & transaction hardening

| Field | Value |
|-------|-------|
| **Objective** | Financial integrity |
| **Priority** | P0 |
| **Complexity** | M |
| **Dependencies** | Phase 1 |

### Backend
- `billing.service.ts`: wrap `createBill` check+create in `$transaction`; serializable bill number
- Validate `payBill` amounts vs balance; idempotency key header
- Pass Prisma `tx` from `consultation.service.ts` into billing helpers (no nested separate transactions)
- Audit log: real IP from request
- Expose `GET /events/billing` OR document queue SSE carries billing events

### Frontend
- `reception/billing/page.tsx`: handle overpayment errors; idempotency on double-click pay

### DB
- Index on `Bill.paymentStatusEnum`, `billingDate`

### Testing
- Concurrent createBill for same caseId → one bill
- Split payment sums to balance → PAID

---

## PHASE 5 — Appointments & schedule hardening

| Field | Value |
|-------|-------|
| **Objective** | Scheduling production-safe |
| **Priority** | P1 |
| **Complexity** | M |
| **Dependencies** | Phase 1 |

### Backend
- `UpdateAppointmentStatusDto` with enum validation
- Use `Holiday` model in slot generation
- Fix appointment check-in: single transaction (pass `tx` to queue create or inline queue create)
- `AppointmentStatusHistory` writes on status change

### Frontend
- `appointments/book/page.tsx`: show holiday/slot errors
- `admin/appointments/page.tsx`: wire to API

### Testing
- Book → check-in → queue entry atomic

---

## PHASE 6 — Reception polish & routes

| Field | Value |
|-------|-------|
| **Objective** | Complete reception UX |
| **Priority** | P1 |
| **Complexity** | S |
| **Dependencies** | Phase 3, 4 |

### Frontend
- Add `app/reception/waiting-display/page.tsx` → `waiting-display` view
- Remove duplicate routes (lab-upload, my-profile) or redirect
- `my-profile/page.tsx`: implement PATCH user profile
- `consent-form/page.tsx`: signature canvas → `signatureUrl`

### Backend
- `PATCH /users/me` DTO
- Consent: accept signature blob/URL

### Testing
- TV route shows live queue via SSE

---

## PHASE 7 — Consultation hardening

| Field | Value |
|-------|-------|
| **Objective** | Clinical workspace production-safe |
| **Priority** | P1 |
| **Complexity** | M |
| **Dependencies** | Phase 3, 4 |

### Backend
- `UpdateConsultationDto` replace `any` on save (`consultation.controller.ts`, `consultation.dto.ts`)
- Narrow `@Roles` on prescription/procedure routes if nursing should not prescribe

### Frontend
- Fix `app/doctor/consultation/page.tsx` redirect → dashboard or case list
- Remove dead sidebar links or add pages (`DoctorSidebar.tsx`)

### Testing
- Full tab save/load cycle
- Finalize → billing items appear

---

## PHASE 8 — Print & export routes

| Field | Value |
|-------|-------|
| **Objective** | Printable Rx and lab reports |
| **Priority** | P2 |
| **Complexity** | S |
| **Dependencies** | Phase 7 |

### Frontend
- `app/print/prescription/[caseId]/page.tsx` → `PrescriptionPrintView.tsx`
- `app/print/lab/[orderId]/page.tsx` → `LabReportPrintView.tsx`
- Print CSS `@media print` in components
- Link from `FinalReportTab`, laboratory process view

### Testing
- Browser print preview renders

---

## PHASE 9 — Admin masters API

| Field | Value |
|-------|-------|
| **Objective** | CRUD for drugs, lab, procedures |
| **Priority** | P1 |
| **Complexity** | L |
| **Dependencies** | Phase 1 |

### Backend (new modules or extend existing)
- `admin/drugs.module.ts` — CRUD `Drug`, `DrugInventory`
- `admin/lab.module.ts` — CRUD `LabCategory`, `LabParameter`, `LabReferenceRange`
- `admin/procedures.module.ts` — CRUD `Procedure`, parameters/consumables
- Guards: `ADMIN` only

### Files
- `backend/src/app.module.ts` imports
- DTOs with nested validation

### DB
- Seed alignment in `seed.ts`

### Testing
- Postman/ e2e CRUD per master

---

## PHASE 10 — Admin UI wire-up

| Field | Value |
|-------|-------|
| **Objective** | Replace static admin arrays |
| **Priority** | P1 |
| **Complexity** | M |
| **Dependencies** | Phase 9 |

### Frontend
- `views/admin/drugs/page.tsx`
- `views/admin/lab/page.tsx`
- `views/admin/procedures/page.tsx`
- `views/admin/patients/page.tsx` → `/patients/search`
- `views/admin/appointments/page.tsx`
- `views/admin/billing/page.tsx` → pending bills API

### Testing
- Admin edits drug → doctor consultation drug list reflects

---

## PHASE 11 — Laboratory workflow completion

| Field | Value |
|-------|-------|
| **Objective** | Sample → results E2E |
| **Priority** | P1 |
| **Complexity** | S |
| **Dependencies** | Phase 3 |

### Frontend
- `LaboratoryPendingView.tsx`: wire COLLECT SAMPLE → status API
- Add missing pages OR remove nav: dashboard, catalog, history

### Backend
- Verify status enum alignment `InvestigationStatus` vs DTO `SAMPLE_COLLECTED`

### Testing
- Order → collect → process → results → doctor sees result

---

## PHASE 12 — Pharmacy SSE & nav

| Field | Value |
|-------|-------|
| **Objective** | Real-time pharmacy queue |
| **Priority** | P2 |
| **Complexity** | S |
| **Dependencies** | Phase 1 |

### Frontend
- `PharmacyQueueView.tsx`: integrate `useQueueSSE` filtered by pharmacy-pending stage
- Add `app/pharmacy/dashboard/page.tsx` stub or remove nav

### Backend
- Optional: pharmacy-specific SSE event type filter

---

## PHASE 13 — Nursing & follow-up module

| Field | Value |
|-------|-------|
| **Objective** | Follow-up calls dynamic |
| **Priority** | P2 |
| **Complexity** | L |
| **Dependencies** | Phase 5 |

### Backend
- `followups.module.ts`: CRUD `Followup`, `Reminder`
- Link to `PatientCase`, `Appointment`

### Frontend
- `nursing/followup/page.tsx`, `doctor/followup-call-list/page.tsx`
- `app/nursing/queue/page.tsx` if needed

### DB
- Use existing `Followup`, `Reminder` models

---

## PHASE 14 — Doctor ancillary screens

| Field | Value |
|-------|-------|
| **Objective** | Billing view + navigation complete |
| **Priority** | P2 |
| **Complexity** | S |
| **Dependencies** | Phase 4 |

### Frontend
- `doctor/billing-view/page.tsx` → `GET /billing/:caseId` read-only
- Doctor profile page or link to shared profile component

---

## PHASE 15 — Password recovery

| Field | Value |
|-------|-------|
| **Objective** | Real forgot/reset flow |
| **Priority** | P2 |
| **Complexity** | M |
| **Dependencies** | Phase 2 |

### Backend
- `POST /auth/forgot-password`, `POST /auth/reset-password`
- Use `OtpVerification` or token table; email provider

### Frontend
- Replace `setTimeout` in forgot/reset pages

---

## PHASE 16 — Public waiting screen

| Field | Value |
|-------|-------|
| **Objective** | Lobby TV accurate |
| **Priority** | P2 |
| **Complexity** | S |
| **Dependencies** | Phase 1, 6 |

### Frontend
- `views/public/waiting-screen/page.tsx` → `useQueueSSE` + live data
- Optional: read-only public token for SSE

### Security
- Public read-only scope (no PHI beyond first name + token if required)

---

## PHASE 17 — Deprecate medical module

| Field | Value |
|-------|-------|
| **Objective** | Remove duplicate pharmacy UI |
| **Priority** | P2 |
| **Complexity** | S |
| **Dependencies** | Phase 12 |

### Frontend
- Redirect `/medical/*` → `/pharmacy/*` in middleware
- Remove medical from login quick-access or map `MEDICAL` role → pharmacy

### Docs
- Update `SYSTEM_WORKFLOW_MASTER.md` role list

---

## PHASE 18 — Multi-branch foundation (optional)

| Field | Value |
|-------|-------|
| **Objective** | Use Clinic/Branch models |
| **Priority** | P3 |
| **Complexity** | XL |
| **Dependencies** | Phase 9 |

### Backend
- Clinic/Branch CRUD; `branchId` on `PatientCase`, `QueueEntry`

### Frontend
- Branch selector in reception header

### DB
- Migration add `branchId` FKs; backfill default branch

---

## PHASE 19 — Schema cleanup

| Field | Value |
|-------|-------|
| **Objective** | Reduce dual fields & dead models |
| **Priority** | P3 |
| **Complexity** | L |
| **Dependencies** | Phases 9–13 |

### DB
- Migrate string statuses → enums only
- Remove or implement unused 33 models (document decision table)
- Fix `Bill` dual relation ambiguity
- Soft-delete policy for cases with bills

### Files
- `backend/prisma/schema.prisma`
- Migration scripts

---

## PHASE 20 — Observability & load test

| Field | Value |
|-------|-------|
| **Objective** | Operate in production |
| **Priority** | P1 before go-live |
| **Complexity** | M |
| **Dependencies** | Phases 1–4 |

### Backend
- Health: DB ping endpoint
- Structured logging (request id)
- Prisma query log in staging

### Ops
- k6/Artillery: login, check-in burst, concurrent billing
- SSE connection limits

### Frontend
- Remove `console.log` from hooks and search

---

## PHASE 21 — OTP profile verification

| Field | Value |
|-------|-------|
| **Objective** | FRD workflow 2.4 |
| **Priority** | P3 |
| **Complexity** | L |
| **Dependencies** | Phase 15 |

### Backend
- `OtpVerification` service; SMS gateway
- Guard sensitive `PATCH /patients/:id` fields

### Frontend
- OTP modal on profile save

---

## PHASE 22 — Device authorization

| Field | Value |
|-------|-------|
| **Objective** | FRD device lock |
| **Priority** | P3 |
| **Complexity** | L |
| **Dependencies** | Phase 2 |

### Backend
- `AuthorizedDevice` CRUD; check on login

### Admin UI
- Device management screen

---

## PHASE 23 — Notifications & SMS

| Field | Value |
|-------|-------|
| **Objective** | Appointment confirm, follow-up |
| **Priority** | P3 |
| **Complexity** | XL |
| **Dependencies** | Phase 5, 13 |

### Backend
- `Notification`, `NotificationTemplate` services
- SMS/WhatsApp provider integration

### Frontend
- Wire `admin/notifications/page.tsx`

---

## PHASE 24 — Analytics & reporting

| Field | Value |
|-------|-------|
| **Objective** | Replace chart placeholders |
| **Priority** | P3 |
| **Complexity** | L |
| **Dependencies** | Phase 4, 10 |

### Backend
- Aggregate queries / `DailyStatistic` population job

### Frontend
- `admin/dashboard`, `admin/reports` with real charts (recharts)

---

## PHASE 25 — SSE horizontal scale

| Field | Value |
|-------|-------|
| **Objective** | Multi-instance deployment |
| **Priority** | P3 |
| **Complexity** | L |
| **Dependencies** | Phase 1 |

### Backend
- Redis pub/sub adapter for `EventsService`
- Sticky sessions or universal Redis bridge

---

## Execution priority table

| Phase | Name | Priority | Complexity | Go-live blocker? |
|-------|------|----------|------------|------------------|
| 1 | Security hotfix | P0 | S | **Yes** |
| 2 | Auth consistency | P0 | S | **Yes** |
| 3 | File uploads | P0 | M | **Yes** |
| 4 | Billing hardening | P0 | M | **Yes** |
| 5 | Appointments | P1 | M | Recommended |
| 6 | Reception polish | P1 | S | Recommended |
| 7 | Consultation | P1 | M | Recommended |
| 8 | Print routes | P2 | S | No |
| 9 | Admin masters API | P1 | L | Yes for admin ops |
| 10 | Admin UI | P1 | M | Yes for admin ops |
| 11 | Laboratory | P1 | S | Recommended |
| 12 | Pharmacy SSE | P2 | S | No |
| 13 | Follow-up | P2 | L | No |
| 14 | Doctor ancillary | P2 | S | No |
| 15 | Password recovery | P2 | M | Recommended |
| 16 | Waiting screen | P2 | S | If using TV |
| 17 | Deprecate medical | P2 | S | Recommended |
| 18 | Multi-branch | P3 | XL | No |
| 19 | Schema cleanup | P3 | L | No |
| 20 | Observability | P1 | M | **Yes** |
| 21–25 | Enterprise FRD | P3 | L–XL | No |

---

## Minimum viable production (MVP) definition

**Can go-live with:** Phases **1, 2, 3, 4, 5, 6, 7, 11, 20** complete.

**Cannot go-live without:** Phase 1 (security), Phase 3 (real uploads if lab/consent required), Phase 4 (billing), Phase 20 (ops).

**Admin-heavy clinics also need:** Phases **9, 10**.

---

## Document maintenance

After each phase:
1. Update `IMPLEMENTATION_STATUS_MATRIX.md` row statuses  
2. Remove entries from `STATIC_VS_DYNAMIC_AUDIT.md` when fixed  
3. Archive outdated `RECEPTION_*.md` claims  

---

*Roadmap version 1.0 — 2026-05-15*
