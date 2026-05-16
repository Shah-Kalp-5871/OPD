# DATABASE RELATION MAP
**System:** MedFlow OPD / Clinic Management System

This document visualizes and explains the relational mappings established in the `FULL_PRISMA_SCHEMA_DESIGN.prisma` file.

---

## 1. The Core Triangle: Patient, Case, and Doctor

At the heart of the system is the **PatientCase**. A Case represents a specific visit session.

*   `Patient` (1) ----< (Many) `PatientCase`
*   `DoctorProfile` (1) ----< (Many) `PatientCase`
*   `PatientCase` acts as the unifying umbrella. Everything that happens during that visit is linked back to the `PatientCase`.

---

## 2. The Patient Profile Explosion

To avoid a 50+ column `Patient` table, demographic and clinical background data is normalized:

*   **1-to-1:** 
    *   `Patient` - `PatientProfile` (DOB, photo, marital status)
    *   `Patient` - `PatientHistory` (past medical, surgical, family history)
*   **1-to-Many:**
    *   `Patient` - `PatientAddress` (Primary, Secondary)
    *   `Patient` - `PatientGuardian` (Father, Mother, Spouse)
    *   `Patient` - `PatientAllergy` (Multiple drug/food allergies)
    *   `Patient` - `PatientDocument` (ID proofs)
    *   `Patient` - `PatientFlag` (Warning labels)

---

## 3. The Clinical Case Ecosystem

When a `PatientCase` is created, it orchestrates multiple sub-entities:

*   **1-to-1:**
    *   `PatientCase` - `QueueEntry` (The real-time position of this case in the physical clinic)
    *   `PatientCase` - `ConsultationRecord` (The Doctor's actual notes: Tab 1 & Tab 6)
    *   `PatientCase` - `Appointment` (The scheduling record that initiated this case)
*   **1-to-Many:**
    *   `PatientCase` - `PatientVital` (Nurse can take BP multiple times during a long session)
    *   `PatientCase` - `InvestigationOrder` (Doctor orders Lab Tests)
    *   `PatientCase` - `Prescription` (Usually one, but could be multiple if edited/re-issued)
    *   `PatientCase` - `ProcedureSession` (If the doctor performs a Laser/Surgical session)
    *   `PatientCase` - `Bill` (Usually one main bill, but could have supplementary bills)
    *   `PatientCase` - `Followup` (Next scheduled visits derived from this case)

---

## 4. The Billing Architecture

Billing is strictly normalized for financial accuracy.

*   `Bill` (1) ----< (Many) `BillItem`
    *   A `BillItem` references exactly what was sold (Consultation, Procedure X, Drug Y). It calculates `unitPrice * quantity - discount`.
*   `Bill` (1) ----< (Many) `BillPayment`
    *   A patient might pay a 5000 INR bill using 2000 INR Cash and 3000 INR UPI. This creates TWO `BillPayment` records linked to ONE `Bill`.

---

## 5. The Pharmacy & Inventory Architecture

Separating the clinical intent (Prescription) from physical stock (Inventory).

*   **Clinical Side:**
    *   `Prescription` (1) ----< (Many) `PrescriptionItem` (The doctor's order: "Take Paracetamol")
*   **Master Data & Inventory Side:**
    *   `Drug` (1) ---- (1) `DrugInventory` (Master record linked to total live stock)
    *   `DrugInventory` (1) ----< (Many) `DrugBatch` (Different expiry dates and supplier batches)
    *   `DrugInventory` (1) ----< (Many) `StockMovement` (The audit trail. Every pill added or dispensed creates a movement record)
*   **The Bridge:**
    *   When the Pharmacist dispenses a `PrescriptionItem`, a `StockMovement` is created against the `DrugInventory`.

---

## 6. The Investigation / Lab Architecture

Structured data allows the system to automatically flag abnormal results.

*   **Master Data:**
    *   `LabCategory` (1) ----< (Many) `LabParameter` (e.g. Category: CBC -> Parameters: WBC, RBC)
    *   `LabParameter` (1) ----< (Many) `LabReferenceRange` (Different normal ranges for Adult Male vs Child)
*   **Transactional Data:**
    *   `InvestigationOrder` (1) ----< (Many) `InvestigationResult`
    *   `InvestigationOrder` (1) ----< (Many) `InvestigationFile` (PDF uploads)
    *   Each `InvestigationResult` links to a `LabParameter`, allowing the UI to instantly compare the `numericValue` against the `LabReferenceRange` and highlight it in RED if abnormal.

---

## 7. The Queue Engine Architecture

Built for high-performance WebSocket/SSE broadcasting.

*   `QueueEntry` holds the current `status` (WAITING, CALLED, IN_SESSION).
*   `QueueEntry` (1) ----< (Many) `QueueHistory`
    *   Every time Reception clicks "Check In" or Doctor clicks "Next Patient", a `QueueHistory` row is inserted. This provides exact timestamps for analytics (e.g. "Average Wait Time in Lobby").
*   `QueueEntry` (1) ----< (Many) `QueueCall`
    *   Tracks how many times the patient's name was flashed on the TV or announced.

---

## Summary of Optimization Strategies

1.  **Cascading Deletes (`onDelete: Cascade`):** Carefully applied to child entities. Deleting a `PatientProfile` when a `Patient` is deleted makes sense. However, `AuditLog` references use `SetNull` to preserve the historical audit trail even if a User is deleted.
2.  **Unique Constraints (`@unique`):** Used heavily on 1-to-1 relationships (`caseId` inside `ConsultationRecord`, `userId` inside `DoctorProfile`) to guarantee data integrity at the database level.
3.  **Cross-Domain Linking:** Domains are deliberately loosely coupled. For instance, a `PrescriptionItem` has a `drugName` string and an optional `drugId`. This means if a doctor prescribes an outside drug not in the inventory, the system doesn't break.
