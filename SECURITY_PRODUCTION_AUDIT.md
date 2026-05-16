# Security & Production Audit — MedFlow OPD

---

## 1. RBAC

### Roles in schema (`Role` enum)
`ADMIN`, `RECEPTION`, `DOCTOR`, `NURSING`, `MEDICAL`, `SUPERADMIN`, `PHARMACY`, `LAB_TECHNICIAN`, `ACCOUNTANT`

### Roles used in `@Roles()` decorators
`ADMIN`, `RECEPTION`, `DOCTOR`, `NURSING`, `MEDICAL`, `PHARMACY`, `LAB_TECHNICIAN`

### Roles never used
`SUPERADMIN`, `ACCOUNTANT`

### Critical RBAC gaps

| Route group | Issue |
|-------------|-------|
| `GET /events/queue`, `GET /events/clinical` | **No auth** — anyone can subscribe |
| `AppointmentsController` | **JwtAuthGuard only** — any role can book/cancel/check-in |
| `QueueController` PATCH status/stage, GET live/stats | Guard present, **no @Roles** → any authenticated user |
| `BillingController` GET bill, GET pending | **No @Roles** |
| `ConsultationController` | Class includes `NURSING` for **entire** controller including prescriptions/procedures |
| `RolesGuard` | If `@Roles` omitted → **allow all authenticated** |

### Frontend RBAC
- `middleware.ts`: cookie `user_role` prefix check for `/admin`, `/doctor`, etc.
- **Gaps:** `/forgot-password`, `/reset-password`, `/waiting-screen` not in matcher
- **Mismatch:** API uses `localStorage` token; middleware uses cookies — can desync
- **Missing redirects:** `PHARMACY`, `LAB_TECHNICIAN` not in `ROLE_REDIRECT_MAP`

---

## 2. Auth guards & token handling

| Item | Finding | Severity |
|------|---------|----------|
| JWT secret | Fallback `'default-secret-key-replace-in-prod'` in `jwt.strategy.ts` | P0 |
| Token expiry | `1d` in `auth.module.ts` | Acceptable if HTTPS |
| Refresh tokens | Not implemented | Medium |
| Login lockout | 5 failures → 15 min lock — **implemented** | Good |
| Password storage | bcrypt in `auth.service.ts` | Good |
| JWT payload | `{ sub, email, role }` — no session id | Medium |
| `UserSession` model | **Unused** | Dead schema |
| Logout | No server-side invalidation | Medium |

---

## 3. Route protection

| Layer | Status |
|-------|--------|
| NestJS global guard | **None** — per-controller only |
| Next.js middleware | Role prefix only; token presence |
| Consultation page | No layout guard beyond middleware |
| API 401 handler | Redirects to login — good |

---

## 4. SSE leakage

| Risk | Detail |
|------|--------|
| Unauthenticated subscription | Full queue patient names, tokens, statuses |
| Clinical stream | Vitals events expose patient/case identifiers |
| Token query param | Frontend sends token; **backend does not validate** on clinical endpoint |
| Cross-role leakage | Doctor queue visible to any subscriber |

**Remediation:** Short-lived stream JWT; role-scoped channels; rate limit.

---

## 5. Role leakage (frontend)

- Static screens don't leak data by API — but **misleading UX** (admin sees fake patients)
- `useQueueSSE` without credentials — if backend later adds auth, must pass token
- Public `waiting-screen` shows static fake patients (no leak, wrong data)

---

## 6. Transaction safety

| Operation | Transaction | Issue |
|-----------|-------------|-------|
| `payBill` | `$transaction` | Good; emits SSE inside callback |
| `createEntry` | `$transaction` | Good |
| `updateStatus` / `updateStage` | `$transaction` | Good |
| `startSession` / `endSession` | `$transaction` | Good |
| `createBill` | Single create | TOCTOU duplicate; bill number race |
| `addItemsToBill` | `$transaction` | Called from consultation outer tx — **not nested atomic** |
| Appointment check-in | Outer tx + `createEntry` inner tx | **Split** |
| Pharmacy dispense | Partial tx usage | Stock race without `SELECT FOR UPDATE` |

---

## 7. Duplicate bill risk

- `createBill`: checks existing by `caseId` then creates — **race** if two concurrent requests
- `ensureActiveBill` in consultation — mitigates but not serializable
- Unique constraints: `Bill.caseId @unique`, `billNumber @unique` — DB will throw on race (500, not graceful)

---

## 8. Race conditions (inventory)

| Area | Pattern |
|------|---------|
| Token number | Count today's entries + increment — concurrent check-in collision |
| Bill number | `generateBillNumber()` read last + increment |
| Case number | Similar in patients service |
| Pharmacy stock | Decrement without locking |

---

## 9. Upload security

| Issue | Detail |
|-------|--------|
| No multipart validation | Frontend skips real upload |
| Dummy hash | Integrity check meaningless |
| Path traversal | Review `file-storage.service.ts` path join |
| Auth on download | Not verified |
| Malware scan | Absent |
| Size limits | Not verified in code |

---

## 10. Validation gaps

| Area | Gap |
|------|-----|
| Global pipe | `whitelist`, `forbidNonWhitelisted` — **good** |
| Consultation save | `any` body — **no validation** |
| Appointment status PATCH | Raw string |
| Payment mode | `string` not `PaymentMode` enum in DTO |
| Pharmacy dispense items | No `@ValidateNested` on array |
| Lab results nested | Partial validation |
| Zod | **Not used** (class-validator only) |

---

## 11. Missing indexes (review)

Existing indexes noted: `AuditLog`, `OtpVerification.mobile`

**Recommended additions:**
- `QueueEntry.checkInTime` + `status` (live queue queries)
- `PatientCase.stage`, `PatientCase.visitDate`
- `Appointment.doctorId` + `appointmentDate`
- `Bill.paymentStatusEnum`
- `InvestigationOrder.status`

---

## 12. Unsafe `any` usage

~50+ files with `: any` or `as any` including:
- `events.service.ts` (event payloads)
- `consultation.service.ts` (`data: any`, prisma casts)
- `billing.service.ts` (`finalItems`)
- Most reception/doctor views (`bill`, `patient` state)

**Risk:** Runtime shape errors, injection via unexpected JSON fields (mitigated partially by whitelist on DTO routes only).

---

## 13. Production checklist

| Control | Status |
|---------|--------|
| HTTPS enforced | Deploy concern |
| Secrets in env | JWT fallback dangerous |
| CORS restricted | Default permissive |
| Rate limiting | Not found |
| Helmet / security headers | Not verified |
| Audit logging | Partial (`AuditLog` on FOC only) |
| Structured logging | Not verified |
| Health checks | `Hello World` only |
| DB backups | Ops concern |
| Error filter | `http-exception.filter.ts` exists |

---

## 14. Priority remediation order

1. Remove JWT default secret; fail fast  
2. Authenticate SSE; scope by role/clinic  
3. Fix `req.user.id` everywhere  
4. Add `@Roles` to appointments, queue reads, billing reads  
5. Wrap `createBill` + number gen in serializable transaction  
6. Real multipart upload + authz on files  
7. Pass `tx` client into billing from consultation (single transaction boundary)  
8. Idempotency keys on `payBill` and dispense  
9. Restrict CORS; add rate limits on login  
10. Replace `any` on consultation save with DTO  

---

*Audit date: 2026-05-15*
