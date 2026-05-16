# MASTER DATABASE ARCHITECTURE
**System:** MedFlow OPD / Clinic Management System  
**Version:** 1.0.0  
**Design Philosophy:** Enterprise Hospital ERP, Highly Normalized, Modular, Scalable & Future-Proof.

---

## 1. DATABASE OVERVIEW

The database architecture for MedFlow is designed to emulate large-scale enterprise Hospital Information Systems (HIS) and Electronic Medical Records (EMR). It strictly adheres to normalization principles, avoiding monolithic "God tables" (like a single giant `Patient` or `Case` table) to prevent technical debt as the clinic expands to multi-branch or full hospital scale.

**Key Architecture Philosophies:**
1. **Modularity & Separation of Concerns:** Every operational domain (Billing, Pharmacy, Nursing, Queue, Settings) has its own cluster of tables.
2. **Audit & Traceability:** Soft deletes (`deletedAt`), created/updated tracking, and dedicated `AuditLog` / `ActivityLog` tables ensure compliance with medical data regulations.
3. **Event-Driven Readiness:** `QueueEntry`, `QueueHistory`, and `CaseStatusHistory` tables enable a highly responsive, real-time UI via Server-Sent Events (SSE).
4. **Financial Accuracy:** Billing and Payment are decoupled. A single `Bill` can have multiple `BillItem` and `BillPayment` records, supporting complex split-payment and discount scenarios.
5. **Multi-Tenant / Branch Readiness:** Entities like `Clinic`, `Branch`, `Department`, and `Room` form the foundational hierarchy, enabling expansion without schema rewrites.

---

## 2. COMPLETE DOMAIN BREAKDOWN

### A. SYSTEM & AUTH DOMAIN
**Purpose:** Manages identity, access control, security, and traceability.
**Why Separated:** Isolates security from clinical data. Prevents user objects from becoming bloated with medical data.
**Key Tables:** `User`, `UserSession`, `AuthorizedDevice`, `LoginHistory`, `OtpVerification`, `AuditLog`, `ActivityLog`.

### B. CLINIC & ORGANIZATION DOMAIN
**Purpose:** Defines the physical and organizational structure.
**Why Separated:** Allows scaling from a single clinic to a multi-branch hospital chain seamlessly.
**Key Tables:** `Clinic`, `Branch`, `Department`, `Room`, `DoctorSchedule`, `ClinicSetting`, `Holiday`.

### C. PATIENT DOMAIN
**Purpose:** Comprehensive demographic and background health data management.
**Why Separated:** Prevents the main `Patient` table from exceeding 50+ columns. Sub-tables (`PatientAddress`, `PatientAllergy`, `PatientHistory`) allow for 1-to-many relationships (e.g., multiple addresses or allergies).
**Key Tables:** `Patient`, `PatientProfile`, `PatientAddress`, `PatientGuardian`, `PatientDocument`, `PatientFlag`, `PatientAllergy`, `PatientHistory`, `PatientInsurance`, `PatientNote`.

### D. APPOINTMENT DOMAIN
**Purpose:** Pre-clinical scheduling and reminders.
**Why Separated:** An appointment is an intent to visit. Not all appointments convert to actual cases (e.g., No-shows, Cancellations).
**Key Tables:** `Appointment`, `AppointmentStatusHistory`, `Followup`, `Reminder`.

### E. CLINICAL CASE DOMAIN
**Purpose:** The central operational hub for a specific patient visit session.
**Why Separated:** Groups all activities (Vitals, Prescriptions, Procedures, Billing) under a single `PatientCase` umbrella.
**Key Tables:** `PatientCase`, `CaseStatusHistory`, `CaseNote`, `CaseTag`, `ConsultationRecord`.

### F. QUEUE ENGINE DOMAIN
**Purpose:** Manages the real-time physical flow of patients in the clinic.
**Why Separated:** Queue state is transient and changes rapidly. Separating it from the `PatientCase` improves performance for SSE/WebSocket polling.
**Key Tables:** `QueueEntry`, `QueueHistory`, `QueueCall`.

### G. NURSING & VITALS DOMAIN
**Purpose:** Pre-consultation assessments and vitals tracking.
**Why Separated:** Vitals can be taken multiple times per case. Storing them in a separate table enables historical trending and charting.
**Key Tables:** `PatientVital`, `TriageAssessment`.

### H. INVESTIGATION DOMAIN
**Purpose:** Lab orders, sample collection, results, and document uploads.
**Why Separated:** Allows integration with external LIMS (Laboratory Information Management Systems). Structured parameters allow automated alerts for critical values.
**Key Tables:** `LabCategory`, `LabParameter`, `LabReferenceRange`, `InvestigationOrder`, `InvestigationResult`, `InvestigationFile`.

### I. PRESCRIPTION DOMAIN
**Purpose:** Medication orders and pharmacy communication.
**Why Separated:** One prescription contains many items. Pharmacists interact with this domain without needing access to clinical notes.
**Key Tables:** `Prescription`, `PrescriptionItem`.

### J. PROCEDURE DOMAIN
**Purpose:** Clinical interventions, multi-session tracking, and resource consumption.
**Why Separated:** Procedures have distinct financial, consent, and scheduling implications compared to standard consultations.
**Key Tables:** `Procedure`, `ProcedureSession`, `ProcedureParameter`, `ProcedureConsumable`, `ProcedureImage`.

### K. IMAGE MANAGEMENT DOMAIN
**Purpose:** Clinical photography and before/after comparisons.
**Why Separated:** Isolates heavy media metadata from fast transactional tables.
**Key Tables:** `ImageFolder`, `ComparisonSession`.

### L. BILLING DOMAIN
**Purpose:** Financial transactions, invoicing, and revenue tracking.
**Why Separated:** Financial data requires strict auditability and support for complex scenarios (FOC, Discounts, Split Payments, Partial Payments).
**Key Tables:** `Bill`, `BillItem`, `BillPayment`.

### M. PHARMACY DOMAIN
**Purpose:** Drug master data, inventory, and dispensing.
**Why Separated:** Inventory management (batches, expiries, minimum stock) is a completely separate workflow from prescribing.
**Key Tables:** `Drug`, `DrugInventory`, `DrugBatch`, `StockMovement`.

### N. NOTIFICATION DOMAIN
**Purpose:** Asynchronous communication (SMS, WhatsApp, Email).
**Why Separated:** Allows background worker queues to process messages without blocking clinical operations.
**Key Tables:** `Notification`, `NotificationTemplate`.

### O. CONSENT & DOCUMENT DOMAIN
**Purpose:** Legal protections and generated PDFs.
**Why Separated:** Manages the lifecycle of a document (Template -> Generated -> Signed).
**Key Tables:** `ConsentTemplate`, `ConsentForm`.

### P. REPORTING & ANALYTICS DOMAIN
**Purpose:** Data warehouse elements for dashboard performance.
**Why Separated:** Aggregated tables (like `DailyStatistic`) prevent heavy `GROUP BY` queries on transactional tables during peak hours.
**Key Tables:** `DailyStatistic`, `ClinicExpense`.

### Q. SYSTEM SETTINGS DOMAIN
**Purpose:** Dynamic configuration without code changes.
**Why Separated:** Centralizes application constants and feature toggles.
**Key Tables:** `MasterSetting`.

---

## 3. HIGH SCALE STRATEGY

1. **UUID Primary Keys:** All IDs are UUIDs. This prevents ID guessing, allows offline ID generation, and ensures smooth database merging if the clinic expands to multiple distinct branches that later consolidate.
2. **Indexing:** 
   - Strict `@@index` on search fields (`firstName`, `lastName`, `mobile`).
   - `@@unique` on business identifiers (`mrdNumber`, `caseNumber`, `billNumber`, `tokenDisplay`).
   - Indexes on foreign keys to prevent table scans during JOIN operations.
3. **Partitioning Potential:** The `QueueHistory`, `ActivityLog`, and `AuditLog` tables will grow rapidly. Their design allows for easy horizontal partitioning by `createdAt` date in PostgreSQL.
4. **Enum Strictness:** Using database-level ENUMS ensures data integrity across different services or microservices reading the same database.

---

## 4. AUDIT & SECURITY DESIGN

1. **Authorized Devices:** The `AuthorizedDevice` table enforces physical security. The reception cannot log in from their home PC.
2. **OTP Flow:** The `OtpVerification` table supports the workflow where editing a patient's mobile number requires an OTP, enforcing data integrity.
3. **Soft Deletes:** `deletedAt` timestamps on critical entities (`User`, `Patient`) ensure data is never lost, maintaining historical integrity for old cases and bills.
4. **Audit Logs:** Every major `CREATE`, `UPDATE`, `DELETE` action can write the exact `oldValues` and `newValues` JSON to the `AuditLog` table.

---

## 5. FILE STORAGE STRATEGY

The database stores `URL` strings (e.g., `fileUrl`, `photoUrl`, `signedDocumentUrl`), not binary blobs. 
Files will be stored in an S3-compatible cloud bucket (AWS S3, Cloudflare R2) or a dedicated local storage volume, organized hierarchically:
`/{clinicId}/patients/{patientId}/cases/{caseId}/documents/`

This ensures the PostgreSQL database remains small, fast, and optimized for relational queries.
