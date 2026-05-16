# Workflow Validation Audit — MedFlow OPD

Each workflow: **Expected** (from `SYSTEM_WORKFLOW_MASTER.md` + architecture intent) vs **Actual** (verified code paths).  
**Risk:** Critical | High | Medium | Low

---

## 1. Reception workflow

### Expected
Register → search → book appointment → check-in → queue → vitals (nursing) → doctor → billing → close case. Real-time queue board. Optional consent/lab upload.

### Actual implementation
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| Register | `reception/patients/register` | `POST /patients` | ✓ CONNECTED |
| Search | `reception/patients/search` | `GET /patients/search` | ✓ |
| Hub / case | `patients/hub` | `POST /patients/:id/cases` | ✓ |
| Appointments | `appointments/book` | `POST /appointments`, slots | ✓ |
| Check-in | `check-in` | `POST /appointments/check-in` or queue | ✓ |
| Live queue | `opd-queue` | `GET /queue/live`, SSE | ✓ |
| Billing | `billing` | `POST /billing`, `POST .../pay` | ✓ |
| Consent | `consent-form` | `/consent/*` | PARTIAL (no signature) |
| Lab upload | `lab-upload` | investigation upload with **mock URL** | BROKEN |

### Missing links
- SMS/WhatsApp confirmation (not implemented)
- OTP profile edit (not implemented)
- Waiting display route not mounted (`waiting-display` orphan)
- Mobile masking in lists (not verified)
- Strict "cannot leave without payment" enforcement — only on `payBill` path, not UI guard

### Broken transitions
- Duplicate routes: `/reception/lab` vs `/reception/lab-upload`, `/reception/profile` vs `/reception/my-profile`

### Fake integrations
- Lab upload mock URL
- Profile update stub

**Risk:** Medium (core path works; compliance uploads fail)

---

## 2. Appointment workflow

### Expected
Doctor schedule → slot generation → book → status history → check-in creates queue entry → reminders.

### Actual
| Step | Implementation |
|------|----------------|
| Slots | `GET /appointments/slots?doctorId&date` — uses `DoctorProfile` times + existing appointments |
| Create | `POST /appointments` with DTO validation |
| List/get | `GET /appointments`, `GET /appointments/:id` |
| Status patch | `PATCH /appointments/:id/status` — **no DTO**, raw string |
| Check-in | `POST /appointments/check-in` → `$transaction` + `queueService.createEntry()` (**nested tx**) |

### Missing
- Holiday calendar enforcement (Holiday model unused)
- SMS reminders (Reminder model unused)
- Role restrictions (any JWT user can call APIs)
- Admin appointments UI static

**Risk:** High (authorization + transaction atomicity)

---

## 3. Nursing workflow

### Expected
Dashboard queue → vitals → lab report upload → follow-up calls.

### Actual
| Step | Status |
|------|--------|
| Dashboard + SSE | ✓ `useQueueSSE` |
| Vitals | ✓ `POST /patients/:id/vitals` → `emitClinicalUpdate` |
| Lab reports upload | PARTIAL — mock URL |
| Follow-up | MOCK ONLY static page |
| Nursing queue page | Missing route |

**Risk:** Medium

---

## 4. Doctor consultation workflow

### Expected
Dashboard → start session → 7-tab consultation → investigations/prescriptions/procedures → finalize → billing/pharmacy/lab routing.

### Actual
| Step | Frontend | Backend |
|------|----------|---------|
| Live queue | dashboard + SSE | `/queue/live`, session start |
| Open case | `/doctor/consultation/[caseId]` | `GET /consultation/:caseId` |
| Auto-save | `useConsultation` debounce | `POST .../save` (**any body**) |
| Investigations | InvestigationsTab | `POST .../investigations` + billing items |
| Prescriptions | PrescriptionTab | `POST .../prescriptions` |
| Procedures | ProceduresTab | `POST .../procedures` + billing |
| Images | ImagesTab | `POST .../images` (**fake URL**) |
| Finalize | FinalReportTab | `POST .../finalize` → stage + SSE |

### Missing / broken
- Old multi-page consultation routes **deleted**; redirect from `/doctor/consultation` still points to removed `/complaints`
- Print prescription/lab — components exist, no routes
- Device/OTP constraints from FRD

**Risk:** High (save DTO + uploads + redirect)

---

## 5. Investigations workflow

### Expected
Doctor orders → lab queue → sample collect → process → results → doctor/nursing visibility → billing if applicable.

### Actual
```
Doctor POST /consultation/:caseId/investigations
  → InvestigationOrder rows + bill items (consultation.service)
Lab GET /laboratory/pending
Lab PUT /laboratory/order/:id/status (SAMPLE_COLLECTED etc.)
Lab POST /laboratory/order/:id/results
  → emitQueueUpdate LAB_RESULTS_READY
Reception/Nursing upload external reports
  → POST /consultation/investigations/:orderId/upload (mock URL from UI)
```

### Missing
- "Collect sample" button unwired in `LaboratoryPendingView.tsx`
- External upload uses fake URL
- No SSE on laboratory page (relies on manual refresh or queue SSE)

**Risk:** Medium

---

## 6. Procedure workflow

### Expected
Doctor selects procedure → session → consumables → billing → consent if surgical.

### Actual
- `POST /consultation/:caseId/procedures` creates `ProcedureSession`
- Billing `ensureActiveBill` / `addItemsToBill` adds line items
- Consent templates exist but **auto-select by procedure** not verified in code

**Risk:** Low–Medium

---

## 7. Billing workflow

### Expected
Auto bill from consultation/procedures → reception collects → split/FOC → receipt → case CLOSED.

### Actual
```
createBill (idempotent by caseId)
payBill ($transaction): payments, FOC, case COMPLETED, queue COMPLETED, SSE PAYMENT_RECEIVED
Frontend: splits array, isFoc, focReason — wired
```

### Gaps
- `createdById` uses broken `req.user.userId`
- No overpayment validation
- Bill number race on concurrent create
- `getBillByCaseId` / `getPendingBills` — no role restriction

**Risk:** High (financial integrity)

---

## 8. Pharmacy workflow

### Expected
Finalize or session end → pharmacy queue → dispense → stock decrement.

### Actual
```
GET /pharmacy/queue
GET /pharmacy/prescriptions/:caseId
POST /pharmacy/dispense
GET /pharmacy/inventory
POST /pharmacy/inventory/:drugId/stock
```

### Missing
- Pharmacy SSE subscription
- Dashboard/history pages
- MEDICAL role legacy UI still in middleware

**Risk:** Medium

---

## 9. Finalization workflow

### Expected
Doctor finalizes → case stage BILLING or PHARMACY → queue updated → reception pays → COMPLETED.

### Actual
- `finalizeConsultation` sets case stage, emits events
- `endSession` with `nextStage` drives BILLING_PENDING / PHARMACY_PENDING / COMPLETED
- Payment closes case in `payBill`

### Gap
- Two paths (finalize vs end session) can confuse stage if used inconsistently

**Risk:** Medium

---

## 10. Consent workflow

### Expected
Template by procedure/language → print → sign → scan upload → stored on case.

### Actual
- `GET /consent/templates`, `GET /consent/case/:caseId`, `POST /consent/case/:caseId`
- UI: template select + save; signature area is **placeholder text**
- `signedById` uses `req.user.userId` (**broken**)

**Risk:** High (legal/compliance)

---

## 11. File upload workflow

### Expected
Multipart → storage → hash → DB URL → access control.

### Actual
- `FileStorageService` writes local disk under `uploads/`
- Hash is **dummy**
- Frontend sends fabricated HTTPS URLs to API
- No static file serving guard documented

**Risk:** Critical

---

## 12. SSE notification workflow

### Expected
Authenticated, role-filtered streams for queue, clinical, billing.

### Actual
| Stream | Endpoint | Auth | Emitters |
|--------|----------|------|----------|
| Queue | `/events/queue` | **None** | queue, billing pay, lab, consultation finalize |
| Clinical | `/events/clinical` | **None** (token in query unused server-side) | vitals saved |
| Billing | — | No HTTP route | consultation billing only |

Frontend: `useQueueSSE` (no JWT on EventSource), `useClinicalSSE` (token in URL but backend ignores).

**Risk:** Critical (data leakage)

---

## Workflow risk summary

| Workflow | Risk |
|----------|------|
| File upload | Critical |
| SSE | Critical |
| Billing | High |
| Appointments | High |
| Consent | High |
| Consultation | High |
| Reception core | Medium |
| Investigations | Medium |
| Pharmacy | Medium |
| Nursing | Medium |
| Finalization | Medium |
| Procedures | Low–Medium |

---

## Appendix: Backend route checklist

**Auth:** `POST /auth/login`  
**Users:** `GET /users/me`  
**Doctors:** CRUD `/doctors`  
**Staff:** CRUD `/staff`  
**Patients:** CRUD, search, vitals, cases  
**Queue:** check-in, status, stage, session start/end, live, stats  
**Billing:** create, get by case, pending list, pay  
**Appointments:** CRUD-ish + slots + check-in  
**Consultation:** masters, CRUD session, investigations, Rx, procedures, images, finalize, upload  
**Consent:** templates, case consent, save  
**Pharmacy:** queue, dispense, inventory, stock update  
**Laboratory:** pending, order detail, status, results  
**Events:** SSE queue, SSE clinical  

**Not implemented:** `/reports`, `/notifications`, `/followups`, `/clinic`, `/otp`, `/devices`, admin master CRUD.
