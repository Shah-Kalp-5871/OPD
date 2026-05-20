# Static vs Dynamic Audit — MedFlow OPD

**Method:** Project-wide search for `mock`, `fake`, `dummy`, `placeholder`, `hardcoded`, `sample`, `static`, `TODO`, `FIXME`, `console.log`, `@ts-ignore`, `setTimeout` simulation, and manual review of views without `api.*` calls.

**Severity key:** P0 = production blocker / data integrity | P1 = major feature fake | P2 = UX/demo | P3 = cosmetic

---

## Master table: Fake / static elements

| Module | Fake/Static Element | File | Severity | Required Replacement |
|--------|---------------------|------|----------|----------------------|
| Backend | Dummy file SHA `sha256_${uuid}` | `backend/src/common/file-storage.service.ts` L33-47 | P0 | Real hash + virus scan + signed URLs |
| Backend | Audit IP hardcoded `127.0.0.1` on FOC | `backend/src/billing/billing.service.ts` | P1 | Request IP from `@Req()` |
| Backend | Room display `'TBD'` when no room | `backend/src/queue/queue.service.ts` | P2 | Room model + doctor assignment |
| Backend | JWT default secret string | `backend/src/auth/jwt.strategy.ts` | P0 | Fail boot if `JWT_SECRET` missing |
| Backend | `AppService.getHello()` | `backend/src/app.service.ts` | P3 | Health check with DB ping |
| Auth | Forgot password simulated API | `frontend/views/auth/forgot-password/page.tsx` L15-19 | P1 | `POST /auth/forgot-password` + email/SMS |
| Auth | Reset password simulated API | `frontend/views/auth/reset-password/page.tsx` L24-28 | P1 | Tokenized reset endpoint |
| Auth | Login prefill credentials | `frontend/views/auth/login/page.tsx` L35-36 | P2 | Remove in production builds |
| Public | Hardcoded `queueData` array | `frontend/views/public/waiting-screen/page.tsx` L35-41 | P0 | `useQueueSSE` + `/queue/live` |
| Reception | Mock lab upload URL | `frontend/views/reception/lab-upload/page.tsx` L108-111 | P0 | Multipart upload → `file-storage` + real URL |
| Reception | Profile update toast only | `frontend/views/reception/my-profile/page.tsx` L176 | P1 | `PATCH /users/me` |
| Reception | Hardcoded branch name | `frontend/views/reception/my-profile/page.tsx` L39,54 | P2 | Clinic/Branch API |
| Reception | Consent signature placeholder UI | `frontend/views/reception/consent-form/page.tsx` L266 | P1 | Canvas capture + store `signatureUrl` |
| Reception | Timeline registration date placeholder | `frontend/views/reception/patients/hub/components/tabs/TimelineTab.tsx` L30 | P2 | Real case history API |
| Reception | Sidebar "Jane Doe" | `frontend/views/partials/reception/ReceptionSidebar.tsx` L77-81 | P3 | `GET /users/me` |
| Reception | `console.log` in search | `frontend/views/reception/patients/search/page.tsx` L40 | P3 | Remove |
| Reception | Waiting display unrouted but real | `frontend/views/reception/waiting-display/page.tsx` | P1 | Add `app/reception/waiting-display/page.tsx` |
| Doctor | Unsplash dummy image URL | `frontend/views/doctor/consultation/components/ImagesTab.tsx` L68-71 | P0 | Multipart upload to storage |
| Doctor | Static follow-up call list | `frontend/views/doctor/followup-call-list/page.tsx` L37+ | P1 | Follow-up API + `Followup` model |
| Doctor | Static billing view | `frontend/views/doctor/billing-view/page.tsx` L27+ | P1 | `GET /billing/:caseId` read-only |
| Doctor | Sidebar "Dr. Sameer Khan" | `frontend/views/partials/doctor/DoctorSidebar.tsx` L80-81 | P3 | `/users/me` |
| Doctor | Broken redirect to deleted route | `frontend/app/doctor/consultation/page.tsx` | P0 | Redirect to dashboard or case picker |
| Doctor | Dead sidebar routes | `DoctorSidebar.tsx` | P1 | Implement or remove links |
| Nursing | Mock lab upload URL | `frontend/views/nursing/lab-reports/page.tsx` L69-73 | P0 | Real upload pipeline |
| Nursing | Static follow-up page | `frontend/views/nursing/followup/page.tsx` L26+ | P1 | Follow-up CRUD API |
| Nursing | Static dashboard follow-up calls | `frontend/views/nursing/dashboard/page.tsx` L51-54 | P1 | API-driven list |
| Nursing | Profile password fields no-op | `frontend/views/nursing/profile/page.tsx` | P1 | Password change API |
| Pharmacy | SSE comment stub | `frontend/views/pharmacy/PharmacyQueueView.tsx` L28 | P2 | `useQueueSSE` or clinical filter |
| Pharmacy | Missing dashboard/history pages | `PharmacyLayout.tsx` nav | P2 | Pages or remove nav |
| Laboratory | COLLECT SAMPLE empty handler | `frontend/views/laboratory/LaboratoryPendingView.tsx` L161 | P1 | `PATCH` status SAMPLE_COLLECTED |
| Laboratory | Missing dashboard/catalog/history | `LaboratoryLayout.tsx` | P2 | Implement or remove |
| Admin | Dashboard chart placeholders | `frontend/views/admin/dashboard/page.tsx` L65-95 | P1 | Analytics API |
| Admin | Reports chart placeholders | `frontend/views/admin/reports/page.tsx` L174-206 | P1 | Reporting service |
| Admin | Static drugs master | `frontend/views/admin/drugs/page.tsx` L26-31 | P0 | Drug CRUD API |
| Admin | Static lab master | `frontend/views/admin/lab/page.tsx` | P0 | Lab master CRUD |
| Admin | Static procedures master | `frontend/views/admin/procedures/page.tsx` | P0 | Procedure CRUD |
| Admin | Static patients list | `frontend/views/admin/patients/page.tsx` | P1 | `GET /patients/search` |
| Admin | Static appointments | `frontend/views/admin/appointments/page.tsx` | P1 | `GET /appointments` |
| Admin | Static billing | `frontend/views/admin/billing/page.tsx` | P1 | Billing list API |
| Admin | Static notifications | `frontend/views/admin/notifications/page.tsx` | P1 | Notification module |
| Admin | Static support/settings | `frontend/views/admin/support/page.tsx`, `settings/page.tsx` | P2 | Ticket/settings APIs |
| Admin | Profile no API | `frontend/views/admin/profile/page.tsx` | P1 | User profile API |
| Admin | `/admin/discounts` route missing | `constants/routes.ts` + sidebar | P2 | Page or remove constant |
| Medical | Static inventory dashboard | `frontend/views/medical/dashboard/page.tsx` | P1 | Deprecate module; redirect PHARMACY |
| Medical | Static stock rows | `frontend/views/medical/stock-management/page.tsx` L26-33 | P1 | Use `/pharmacy/inventory` |
| Medical | Static dispensing | `frontend/views/medical/dispensing/page.tsx` | P1 | Use pharmacy dispense |
| Hooks | `console.log` queue debug | `frontend/hooks/useQueueSSE.ts` L43,50,59 | P3 | Remove / use debug flag |
| Consultation | `Body() data: any` on save | `backend/src/consultation/consultation.controller.ts` | P0 | `UpdateConsultationDto` |
| Print | No routes for print views | `frontend/views/print/*.tsx` | P2 | `app/print/...` routes |

---

## UI-only workflows (frontend pretends persistence)

| Workflow | Screen | What happens | Backend needed |
|----------|--------|--------------|----------------|
| Password recovery | forgot/reset | `setTimeout` success | Auth reset flow |
| Admin master edit | drugs/lab/procedures | Local state only | CRUD modules |
| Admin analytics | dashboard/reports | Placeholder boxes | Aggregation queries |
| Medical stock adjust | stock-management | UI forms, no submit | Pharmacy inventory API |
| Doctor follow-up reschedule | followup-call-list | Display only | Followup module |
| Lab collect sample | LaboratoryPendingView | Empty onClick | Status transition API |
| Reception profile | my-profile | Toast "coming soon" | PATCH user |
| Public TV queue | waiting-screen | Static array | SSE + live queue |

---

## local-only state pretending to persist

| Location | State | Risk |
|----------|-------|------|
| Admin drugs/lab/procedures | `useState` arrays seeded inline | Refresh loses "edits" |
| Medical stock | Inline `inventory` array | Never hits DB |
| Doctor follow-up/billing views | Static `useState` tables | Misleading demos |
| Nursing follow-up | Static queue | Ops cannot schedule |

---

## Search totals (approximate)

| Pattern | TS/TSX hits (incl. benign UI `placeholder=` attrs) |
|---------|---------------------------------------------------|
| `placeholder` (input attrs) | ~200+ (mostly benign) |
| `mock` / `Mock` | 4 critical (upload URLs) |
| `fake` / `dummy` | 2 backend |
| `console.log` | 8 files (frontend hooks + reception search) |
| `TODO` / `FIXME` | **0** in application TS (none found) |
| `: any` / `as any` | 50+ files (~80+ occurrences) |

---

## Replacement priority queue

1. **P0:** Real file upload pipeline; remove mock URLs; secure SSE; fix JWT secret; typed consultation save DTO.
2. **P1:** Admin masters APIs; follow-up module; auth reset; waiting-screen dynamic; fix `userId` bug.
3. **P2:** Route gaps; deprecate `/medical/*`; profile saves; pharmacy SSE.
4. **P3:** Remove debug logs; sidebar hardcoded names; chart polish.

---

*Verified against repository snapshot 2026-05-15. Re-run grep after each sprint.*
