# Performance Audit — MedFlow OPD

---

## 1. Frontend — unnecessary rerenders

| Location | Issue | Severity |
|----------|-------|----------|
| `useQueueSSE` | Each SSE message → `setLastEvent` + full `fetchQueue` + `fetchStats` | Medium |
| `reception/billing` | `useEffect` on `lastEvent` refetches all pending bills | Medium |
| `useConsultation` | Debounced save (good); `updateComplaint` may recreate callbacks | Low |
| Consultation page | Large tab tree; all tab components imported upfront | Low |
| Admin static pages | Entire arrays in state — N/A (no API) | Low |

**Mitigation:** Debounce SSE refresh; diff event types; React.memo on queue rows.

---

## 2. Large components

| File | Approx concern |
|------|----------------|
| `reception/billing/page.tsx` | 600+ lines — monolith |
| `reception/opd-queue/page.tsx` | Large table + filters |
| `consultation/page.tsx` + tabs | Many subcomponents — acceptable split |
| Admin master pages | Large but static — low runtime cost |

**Recommendation:** Split billing into hooks + subcomponents (maintainability, not urgent perf).

---

## 3. Duplicated logic

| Duplication | Files |
|-------------|-------|
| Lab upload mock URL pattern | `reception/lab-upload`, `nursing/lab-reports` |
| Queue patient card formatting | reception, doctor, nursing dashboards |
| API error toast handling | Most views — could be hook |
| Medical vs Pharmacy inventory UI | Parallel implementations |

---

## 4. Missing pagination

| Endpoint / UI | Issue |
|---------------|-------|
| `GET /patients/search` | Frontend may load full result set |
| `GET /queue/live` | Returns today's full queue — OK for small clinic, scales poorly |
| `GET /billing/list/pending` | Full list to billing page |
| Admin patients table | Static — N/A |
| `GET /appointments` | No cursor pagination visible |

---

## 5. Heavy tables

- OPD queue: renders all entries with animations — **watch DOM size > 100 entries**
- Pending bills: no virtualisation
- Pharmacy inventory: single fetch — OK

---

## 6. SSE memory leaks

| Hook | Concern |
|------|---------|
| `useQueueSSE` | `useEffect` cleanup closes EventSource — **good** |
| `useClinicalSSE` | Same pattern — verify dependency array |
| Multiple subscribers | Each page mount opens new SSE connection — **duplicate connections** if user navigates without unmount |

**Risk:** Doctor dashboard + reception queue both open SSE — expected; multiple tabs = duplicate streams.

**Backend:** In-memory RxJS subjects — **single-server only**; no horizontal scale without Redis pub/sub.

---

## 7. Infinite loops

- No `while` loops found in hooks
- `useEffect` dependency on `lastEvent` objects — new object each SSE → **may over-fetch** (not infinite but noisy)

---

## 8. Backend — expensive queries

| Service | Pattern | N+1 risk |
|---------|---------|----------|
| `getLiveQueue` | include patient, case, doctor | Review includes — likely OK with `include` |
| `getPendingBills` | include relations | Medium |
| `findAll` patients search | depends on query | Check skip/take |
| Consultation `getOrCreateConsultation` | deep includes | Heavy but once per session |
| Laboratory pending | list + includes | OK |

**Action:** Add Prisma query logging in staging; profile `getLiveQueue` and consultation load.

---

## 9. N+1 risks

- Loop + individual queries in services — manual review recommended for:
  - `consultation.service.ts` investigation creation
  - `pharmacy.service.ts` dispense loop
- Prefer `createMany`, nested writes, or `include` batches

---

## 10. Caching

- **No HTTP caching** headers on API
- **No React Query / SWR** — manual fetch in `useEffect`
- Master data (drugs, lab tests) fetched per tab mount — could cache session-wide

---

## 11. Bundle size (not measured)

- Lucide icons imported per file — tree-shaking likely OK
- No dynamic import on consultation tabs — optional code-split by tab

---

## 12. Priority performance work

| P | Task |
|---|------|
| P1 | Debounce/limit SSE-triggered REST refetches |
| P1 | Add pagination to patient search + pending bills |
| P2 | Redis-backed SSE for multi-instance |
| P2 | React Query for queue/billing cache |
| P3 | Code-split consultation tabs |
| P3 | Virtualize OPD queue table |

---

*Performance audit date: 2026-05-15. No load testing performed — code review only.*
