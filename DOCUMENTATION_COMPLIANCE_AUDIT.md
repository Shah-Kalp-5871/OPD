# Documentation Compliance Audit — MedFlow OPD

Comparison of **documentation claims** vs **verified code reality**.

---

## Sources audited

| Document | Type | Trust level |
|----------|------|-------------|
| `SYSTEM_WORKFLOW_MASTER.md` | FRD-style master workflows | Aspirational — many features absent |
| `RECEPTION_PRODUCTION_READINESS.md` | Readiness % | **Outdated** on appointments/billing |
| `RECEPTION_IMPLEMENTATION_REPORT.md` | Sprint report | Planning complete ≠ code complete |
| `RECEPTION_DYNAMIC_AUDIT.md` | Gap analysis | Partially superseded |
| `RECEPTION_API_MAP.md` | API map | Verify per endpoint |
| `RECEPTION_FLOW_GAP_REPORT.md` | Gaps | Mixed accuracy |
| `RECEPTION_MISSING_ITEMS.md` | Backlog | Still largely valid |
| `RECEPTION_WORKFLOW_VALIDATION.md` | Workflow | Cross-check with this audit |
| `db_doc/MASTER_DATABASE_ARCHITECTURE.md` | Schema target | Not fully utilized in app |
| `db_doc/MIGRATION_*.md` | Migration | Planning artifacts |
| `PROJECT_RULES.md` | Conventions | Process doc |
| `STACK.md` | Stack | Accurate |

---

## Claims vs reality table

| Feature claimed | Source | Actual reality | Gap | Risk |
|-----------------|--------|----------------|-----|------|
| Appointments "completely static" | `RECEPTION_PRODUCTION_READINESS.md` | `appointments/book` calls `GET /doctors`, `/appointments/slots`, `POST /appointments` | Doc false | Low (doc only) |
| Billing missing split/FOC | Same | `PayBillDto` + billing UI implement splits + `isFoc` | Doc false | Low |
| Consent "mock UI only" | Same | Consent API + DB save works; signature UI placeholder | Partial | High (legal) |
| Lab upload "mock UI only" | Same | API exists; **UI sends mock URL** | Accurate | Critical |
| Reception 60% production ready | Same | Core ~80% connected; compliance uploads block | Under/over mixed | Medium |
| "Completed architectural tasks" | `RECEPTION_IMPLEMENTATION_REPORT.md` | Planning/mapping only; not full dynamic conversion | Misleading if read as code done | Medium |
| Strict RBAC all screens | `SYSTEM_WORKFLOW_MASTER.md` | Gaps: SSE public, appointments, queue/billing reads | Large | Critical |
| OTP for profile edits | Master workflow | Not implemented | Full feature missing | High |
| Device-authorized login only | Master workflow | Not implemented | Full feature missing | High |
| Mobile masking in lists | Master workflow | Not verified in components | Likely missing | Medium |
| SMS/WhatsApp appointment confirm | Master workflow | Not implemented | Full feature missing | Medium |
| TTS on waiting display | `RECEPTION_PRODUCTION_READINESS.md` action plan | `waiting-display` has audio play; public screen static | Partial | Low |
| SSE replaces all polling | Readiness doc | `useQueueSSE` still fetches REST on events | Accurate design | Low |
| 76-model enterprise DB "in use" | `db_doc/*` | ~43 models referenced in `backend/src` | 33 orphan models | Medium |
| Admin drugs/lab/procedures management | Implied by admin UI | Static arrays only | Full CRUD missing | High |
| Multi-branch clinics | Schema + docs | Models exist, zero API | Not started | Medium |
| Pharmacy module complete | Git status / layouts | 3 pages connected; nav holes | Partial | Low |
| Doctor consultation multi-page routes | Old structure | Consolidated to `[caseId]` tabs — **good**; redirect broken | Small bug | Medium |
| Production schema in `db_doc/PRODUCTION_SCHEMA.prisma` | db_doc | **Not** the runtime `backend/prisma/schema.prisma` | Two sources of truth | High |

---

## Falsely marked complete (or misleading)

| Item | Why misleading |
|------|----------------|
| RECEPTION "Completed Architectural Tasks" | Documents written ≠ reception 100% dynamic |
| RECEPTION readiness "Queue Core Engine... perfect" | Token generation has race conditions |
| Admin UI screens present | Visual completeness implies backend — **false** |
| Medical module in middleware | Appears supported; data is static |
| `emitBillingUpdate` in events service | Backend emits but **no client subscription path** |

---

## Partially complete (accurate with caveats)

| Item | Caveat |
|------|--------|
| Reception billing | Works; `userId` audit bug |
| Appointments | API works; no RBAC |
| Consultation 7 tabs | Save body untyped; images fake |
| Laboratory | Results yes; sample collect no |
| Consent | DB yes; signature no |

---

## Outdated reports (should archive or update)

1. `RECEPTION_PRODUCTION_READINESS.md` — update appointments/billing sections  
2. `RECEPTION_IMPLEMENTATION_REPORT.md` — clarify "planning complete"  
3. Any doc referencing `/doctor/consultation/complaints` separate pages — **removed**  
4. `db_doc/PRODUCTION_SCHEMA.prisma` — label as target schema, not deployed  

---

## Missing promised features (from master workflow, not in code)

1. OTP verification for demographic edits  
2. Authorized device login restriction  
3. Follow-up call workflow with SMS reschedule  
4. Notification templates / push  
5. Clinic/Branch multi-tenant operations  
6. Patient insurance, allergies as structured entities (models exist, unused)  
7. Comparison sessions / image folders (models exist, unused)  
8. Daily statistics / clinic expenses reporting  
9. Accountant role workflows  
10. Discount admin page (`ROUTES.ADMIN_DISCOUNTS`)  

---

## Documentation hierarchy (recommended)

```
FINAL_IMPLEMENTATION_ROADMAP.md  ← execution
MASTER_SYSTEM_AUDIT.md           ← topology
WORKFLOW_VALIDATION_AUDIT.md     ← flows
IMPLEMENTATION_STATUS_MATRIX.md  ← status
STATIC_VS_DYNAMIC_AUDIT.md       ← fakes
SECURITY_PRODUCTION_AUDIT.md     ← hardening
SYSTEM_WORKFLOW_MASTER.md        ← product spec (aspirational)
db_doc/*                         ← schema planning only
RECEPTION_*.md                   ← historical; update or archive
```

---

*Compliance audit date: 2026-05-15*
