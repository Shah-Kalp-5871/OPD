# MedFlow AI Usage Policy

**Version:** 1.0 | **Date:** 2026-05-18 | **Classification:** CLINICAL GOVERNANCE

---

## 1. Purpose

This policy governs the use of Artificial Intelligence (AI) and Clinical Decision Support (CDS) features within the MedFlow OPD System. It establishes clear boundaries for AI-assisted clinical workflows to ensure patient safety, regulatory compliance, and physician autonomy.

---

## 2. Scope

This policy applies to:

- All clinical staff using MedFlow (Doctors, Nurses, Pharmacists)
- All administrators and managers accessing AI analytics
- All AI-generated outputs within the system (CDS, Risk Flags, Forecasts, Anomalies)

---

## 3. Core Principles

### 3.1 Assistive AI Only

All AI features in MedFlow are **strictly assistive**:

- AI suggestions are **recommendations**, never commands
- Doctors retain **full clinical authority** at all times
- No AI output may autonomously modify patient records, prescriptions, or treatment plans
- AI outputs are labeled with confidence scores and disclaimers

### 3.2 Explainability

All AI suggestions must be explainable:

- ICD-10 suggestions show **matched keywords** from the chief complaint
- Drug interaction warnings show the **mechanism, clinical effect, and recommendation**
- Anomaly alerts show the **evidence data** that triggered them
- Risk flags show the **threshold values** that were breached

### 3.3 Human Override

Doctors may accept, modify, or reject any AI suggestion. All outcomes are:
- Logged immutably in the `AiSuggestionLog` table
- Traceable by audit date, physician, and outcome type
- Never retroactively altered

---

## 4. What AI Will NOT Do

| Prohibited Action | Reason |
|---|---|
| Make an autonomous diagnosis | Medical diagnosis requires human clinical judgment |
| Prescribe medications without doctor confirmation | Prescription is a regulated clinical act |
| Modify patient records without doctor action | Immutability of clinical records |
| Send clinical recommendations to patients | Doctor-patient communication must be physician-controlled |
| Override a doctor's prescription decision | Physician autonomy is paramount |
| Access data outside the user's authorized branch | Multi-tenant data isolation |

---

## 5. AI Feature Inventory

| Feature | Module | Access Role | Audit Logged |
|---|---|---|---|
| ICD-10 Symptom Suggestions | CDS | DOCTOR | ✅ Yes |
| Drug Interaction Warnings | CDS | DOCTOR | ✅ Yes |
| Allergy Conflict Alerts | CDS | DOCTOR | ✅ Yes |
| Duplicate Medication Detection | CDS | DOCTOR | ✅ Yes |
| Chronic Disease Risk Checks | CDS | DOCTOR | ✅ Yes |
| Abnormal Vitals Flags | Risk Engine | DOCTOR, NURSING | ✅ Yes |
| Repeat Emergency Detection | Risk Engine | DOCTOR | ✅ Yes |
| Stock Exhaustion Forecast | Inventory AI | PHARMACY, MANAGER | ✅ Yes |
| Expiry Risk Report | Inventory AI | PHARMACY, MANAGER | ✅ Yes |
| Reorder Recommendations | Inventory AI | PHARMACY, MANAGER | ✅ Yes |
| No-Show Prediction | Ops Intel | MANAGER | ✅ Yes |
| Revenue Forecast | Ops Intel | FINANCE, MANAGER | ✅ Yes |
| Billing Anomaly Detection | Ops Intel | FINANCE, ADMIN | ✅ Yes |
| Refund Anomaly Detection | Ops Intel | FINANCE, ADMIN | ✅ Yes |
| Stock Adjustment Anomaly | Ops Intel | ADMIN | ✅ Yes |

---

## 6. Data Privacy

- AI modules process only data within the authorized branch scope
- Patient-identifiable data is never sent to external AI services
- All AI computation is performed **on-premise** within MedFlow
- AI audit logs are retained for minimum 7 years (clinical audit standard)

---

## 7. Incident Reporting

If AI output appears incorrect, misleading, or potentially harmful:

1. **Do not follow the suggestion** — use clinical judgment
2. **Reject the suggestion** using the "Reject" button (this is logged)
3. **Report to Clinic IT Lead** with the Suggestion Log ID (shown on screen)
4. IT Lead reviews via `/api/ai/audit/logs` and escalates if needed

---

## 8. Policy Review

This policy shall be reviewed:
- Every 6 months
- After any significant AI feature change
- After any AI-related adverse event

**Approved by:** Clinical Governance Committee  
**Next Review:** 2026-11-18
