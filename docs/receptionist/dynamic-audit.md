# RECEPTION DYNAMIC AUDIT

## Overview
This document serves as the Phase 1 audit of the Reception Module (`frontend/views/reception/*`). It identifies the current state of API integration, hardcoded data, and missing functionality for each operational page to transition the system to a production-ready, dynamic state.

## 1. Dashboard (`/dashboard`)
- **Static vs Dynamic:** Partially Dynamic.
- **Current State:** API calls exist for `/queue/stats` and `/queue/live` with basic polling.
- **Mock Data/Fake Elements:** Hardcoded status styling logic, no real revenue/financial charts, hardcoded static placeholders for some KPI tiles.
- **Missing API Integration:** Real revenue analytics, doctor active counts, true historical comparisons.
- **Missing Features:** Real-time SSE integration (currently using interval polling), error boundary states.

## 2. Check-In (`/check-in`)
- **Static vs Dynamic:** Mostly Dynamic.
- **Current State:** Connects to `api/patients/search` and doctors list. BMI auto-calculates.
- **Mock Data/Fake Elements:** None. 
- **Missing API Integration:** None identified initially, but needs testing against the new database schema for `priorityEnum` and `genderEnum`.
- **Missing Features:** Conflict resolution (e.g., patient already checked in today).

## 3. Queue Management (`/opd-queue`)
- **Static vs Dynamic:** Fully Dynamic.
- **Current State:** Uses `useQueueSSE` hook and `/queue` APIs.
- **Missing Features:** Missing UI for new Enterprise features (reassigning doctor mid-queue, suspending token, transitioning to `BILLING_PENDING` vs `PHARMACY_PENDING`).

## 4. Patient Hub (`/patients/hub`)
- **Static vs Dynamic:** Fully Dynamic.
- **Current State:** Fetches patient data by ID, fetches active cases.
- **Missing Features:** Integration with newly added Enterprise tables (Notes, Documents, Insurance, Guardian).

## 5. Billing (`/billing`)
- **Static vs Dynamic:** Partially Dynamic.
- **Current State:** Listens to SSE for `SESSION_ENDED` to show pending bills.
- **Mock Data/Fake Elements:** Item generation logic might be missing dynamic procedure sync.
- **Missing Features:** Split payments, FOC (Free of Charge) handling, Discount validations, Receipt PDF generation, transaction logging to the new `AuditLog`.

## 6. Appointments (`/appointments/book`)
- **Static vs Dynamic:** Completely Static.
- **Current State:** UI ONLY. No backend integration.
- **Mock Data/Fake Elements:** `timeSlots` array, `holidays` array, `patientCategory` logic, UI simulation of `caseId`.
- **Missing API Integration:** Doctor schedule sync, actual slot validation, DB mutation for booking, duplicate validation.

## 7. Consent Forms (`/consent-form`)
- **Static vs Dynamic:** Completely Static.
- **Current State:** UI ONLY. 
- **Mock Data/Fake Elements:** `patientData`, `templates`, `languages` are all hardcoded objects.
- **Missing API Integration:** Needs backend for `ConsentTemplate` retrieval, dynamic patient data population based on `caseId`, saving signed consent to `ConsentForm` DB table.

## 8. Lab Uploads (`/lab-upload`)
- **Static vs Dynamic:** Completely Static.
- **Current State:** UI ONLY.
- **Mock Data/Fake Elements:** Fake upload progress, fake patient data.
- **Missing API Integration:** True multipart/form-data upload, AWS S3/local file storage linking, `InvestigationOrder` and `InvestigationFile` DB insertion.

## 9. Waiting Display (`/waiting-display`)
- **Static vs Dynamic:** Dynamic.
- **Current State:** Reads from `/queue/display` via API.
- **Missing Features:** Missing Web Speech API (TTS announcements), robust reconnection logic, fallback empty states.

---
## Summary of Gaps
1. **Critical Refactoring Needed:** `Appointments`, `Consent Forms`, and `Lab Uploads` require 100% replacement of mock data with full REST + Prisma logic.
2. **Missing Architectural Ties:** The recently merged Enterprise Schema (e.g. `genderEnum`, `priorityEnum`, `InvestigationOrder`, `ConsentTemplate`) has NOT yet been linked to the frontend endpoints.
3. **SSE Improvements:** Dashboard relies on 10s polling instead of the existing `useQueueSSE`.
