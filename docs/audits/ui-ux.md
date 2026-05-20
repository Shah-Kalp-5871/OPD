# UI/UX Audit — MedFlow OPD

**Scope:** All routed pages under `frontend/app/**` and primary `views/**` layouts.  
**Design system:** Tailwind utility classes; consultation uses `ClinicalDesignSystem.tsx`; global styles in `app/globals.css`.

---

## 1. Layout architecture

| Layout | Path | Notes |
|--------|------|-------|
| AdminLayout | `views/layouts/AdminLayout.tsx` | Sidebar + header; consistent |
| ReceptionLayout | `views/layouts/ReceptionLayout.tsx` | Teal accent; production quality |
| DoctorLayout | `views/layouts/DoctorLayout.tsx` | Mobile overlay placeholder comment |
| NursingLayout | `views/layouts/NursingLayout.tsx` | Mobile overlay placeholder |
| MedicalLayout | `views/layouts/MedicalLayout.tsx` | Legacy emerald theme |
| PharmacyLayout | `views/layouts/PharmacyLayout.tsx` | Inline nav (no partial sidebar) |
| LaboratoryLayout | `views/layouts/LaboratoryLayout.tsx` | Inline nav |
| Consultation | **No layout** — full viewport workspace | Intentional |

**Inconsistency:** Pharmacy/Lab use inline nav; other roles use dedicated sidebar partials.

---

## 2. Enterprise design quality by module

| Module | Rating | Notes |
|--------|--------|-------|
| Doctor consultation workspace | **A-** | Cohesive tabs, loading states, clinical workspace |
| Reception operational pages | **B+** | Strong forms/tables; dense but usable |
| Pharmacy | **B** | Functional; less polish than reception |
| Laboratory | **B** | Clean process UI |
| Nursing vitals | **B** | Form-heavy, adequate |
| Doctor dashboard | **B** | Queue cards work |
| Admin (except doctors/staff) | **D** | Pretty mockups, placeholder charts |
| Medical legacy | **D** | Static demo tables |
| Public waiting screen | **F** | Static wrong data |
| Auth pages | **B-** | Modern; prefill hurts prod perception |

---

## 3. Broken / dead navigation

| Issue | Location |
|-------|----------|
| `/doctor/consultation` → 404 complaints route | `app/doctor/consultation/page.tsx` |
| Doctor sidebar dead links | queue, appointments, pharmacy, reports, profile |
| Pharmacy dashboard/history | Layout links, no pages |
| Laboratory dashboard/catalog/history | Same |
| Admin discounts | `ROUTES.ADMIN_DISCOUNTS` |
| Nursing queue | Sidebar only |
| Reception waiting-display | View exists, no route |

**UX impact:** User trust erosion on click → 404.

---

## 4. Responsiveness

| Area | Assessment |
|------|------------|
| Consultation workspace | Desktop-first; cramped on mobile |
| Reception tables | Horizontal scroll on small screens — acceptable |
| Admin tables | Wide tables without pagination |
| Layout sidebars | Doctor/Nursing "mobile overlay placeholder" — **not implemented** |
| Pharmacy/Lab | Simpler layouts — mobile OK |

---

## 5. Tables & data density

| Screen | Issue |
|--------|-------|
| Reception billing pending list | Long list, no virtual scroll |
| Admin patients | Static, no pagination |
| OPD queue | Real-time refresh — good; can flicker on SSE |
| Medical stock | Static wide table |

---

## 6. Scroll & overflow

| Item | Status |
|------|--------|
| `frontend/docs/SCROLLBAR_SYSTEM_REPORT.md` | Documents scrollbar system — verify adoption |
| Consultation tab content | Internal scroll areas — generally OK |
| Global overflow | No systemic audit of `overflow-hidden` traps |

---

## 7. Dark/light consistency

- **Light mode only** across app (slate/white palettes)
- No dark mode toggle found
- Consultation uses blue/indigo accents vs reception teal — **acceptable role differentiation**

---

## 8. Typography & spacing

- Heavy use of `font-black`, `uppercase tracking-widest` — consistent brand voice
- Occasional mix of `text-[10px]` through `text-lg` — intentional hierarchy
- **Issue:** Admin and medical use similar patterns but static data reduces perceived quality

---

## 9. Hydration & flicker risks

| Risk | Location |
|------|----------|
| `useSearchParams` in billing | Client-only — OK with `'use client'` |
| SSE initial empty → REST populate | `useQueueSSE` may flash empty queue |
| Date formatting | `date-fns` client-side — OK |
| Login cookie + localStorage | Potential mismatch flash |

---

## 10. Forms & feedback

| Good | Bad |
|------|-----|
| `sonner` toasts widely used | Profile "coming soon" toast |
| Loading spinners on consultation | Admin saves with no API feedback |
| Debounced consultation save | Collect sample button does nothing |

---

## 11. Accessibility (spot check)

- Many icons without `aria-label` on icon-only buttons
- Signature placeholder not accessible capture
- Color-only status indicators (queue) — supplement with text (partially present)

---

## 12. Print UX

- `PrescriptionPrintView.tsx`, `LabReportPrintView.tsx` exist
- **No routes** — cannot print from browser URL
- FinalReportTab may link — verify print CSS `@media print` in components

---

## 13. Priority UI fixes

| P | Fix |
|---|-----|
| P0 | Fix doctor consultation redirect |
| P0 | Wire waiting-screen to live SSE or remove from production |
| P1 | Remove dead sidebar links or add pages |
| P1 | Add pharmacy/lab missing pages or trim nav |
| P1 | Route `waiting-display` for reception TV |
| P2 | Implement mobile sidebars (claimed placeholders) |
| P2 | Paginate large admin/reception lists |
| P2 | Add print routes |
| P3 | Unify Pharmacy/Lab layout with sidebar partial pattern |
| P3 | Remove login prefill credentials |

---

*UI audit date: 2026-05-15*
