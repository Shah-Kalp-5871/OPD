# MedFlow Clinical AI Safety Framework

**Version:** 1.0 | **Date:** 2026-05-18 | **Classification:** CLINICAL GOVERNANCE

---

## 1. Safety Architecture

MedFlow's AI system uses a **rule-based, explainable architecture**. There are **no black-box neural networks** in the clinical decision pipeline. Every suggestion can be traced to its exact rule and matched data.

```
Patient Data (Vitals, Allergies, Complaint, Rx)
         │
         ▼
  Rule Engine (Deterministic)
  ┌──────────────────────────────────────┐
  │  SYMPTOM_RULES  ← ICD-10 mapping    │
  │  DRUG_INTERACTIONS ← PK database     │
  │  VITAL_THRESHOLDS ← clinical limits  │
  │  ALLERGY_RULES  ← allergen matching  │
  └──────────────────────────────────────┘
         │
         ▼
  Suggestions (with confidence score + disclaimer)
         │
         ▼
  Doctor Reviews → Accept / Modify / Reject
         │
         ▼
  AiSuggestionLog (immutable audit record)
```

---

## 2. Clinical Safety Boundaries

### 2.1 Vital Sign Thresholds

All thresholds are configurable and based on established clinical guidelines:

| Parameter | Low Alert | Critical Low | High Alert | Critical High |
|---|---|---|---|---|
| Systolic BP | 90 mmHg | 80 mmHg | 140 mmHg | 180 mmHg |
| Diastolic BP | 60 mmHg | 50 mmHg | 90 mmHg | 110 mmHg |
| Pulse | 50 bpm | 40 bpm | 100 bpm | 130 bpm |
| Temperature | 36.0°C | 35.0°C | 37.5°C | 39.5°C |
| SpO2 | 94% | 88% | — | — |
| BMI | 18.5 | 15 | 25 | 40 |

### 2.2 Drug Interaction Severity Levels

| Level | Meaning | Action |
|---|---|---|
| MILD | Minor interaction, monitor | Advisory only |
| MODERATE | Clinically significant | Warning shown, doctor must confirm |
| SEVERE | Serious risk | Strong warning, documented |
| CONTRAINDICATED | Absolutely must not combine | Critical alert |

---

## 3. Audit & Traceability

Every AI suggestion displayed to a clinician creates an immutable `AiSuggestionLog` record:

```json
{
  "id": "uuid",
  "moduleType": "CLINICAL_DECISION",
  "entityType": "PatientCase",
  "entityId": "case-uuid",
  "inputContext": { "chiefComplaint": "...", "prescribedDrugs": [...] },
  "suggestions": [ { "type": "ICD_SUGGESTION", "confidence": 75, ... } ],
  "confidenceScore": 75,
  "outcome": "ACCEPTED",
  "reviewedById": "doctor-uuid",
  "reviewedAt": "2026-05-18T10:00:00Z"
}
```

**Outcome tracking:**
- `SHOWN` — suggestion was displayed (initial state)
- `ACCEPTED` — doctor accepted the suggestion
- `MODIFIED` — doctor modified before accepting
- `REJECTED` — doctor explicitly rejected
- `IGNORED` — session ended without action

---

## 4. Confidence Score Interpretation

| Score | Interpretation | Clinical Action |
|---|---|---|
| 80–100 | High confidence — strong keyword/rule match | Consider seriously |
| 60–79 | Moderate confidence — partial match | Review carefully |
| 40–59 | Low confidence — weak match | Use with caution |
| 0–39 | Very low confidence | Informational only |

**Important:** Even 100% confidence does NOT replace clinical judgment. Confidence reflects rule match strength, not diagnostic certainty.

---

## 5. Limitations and Disclaimers

### What the AI Cannot Assess

- Patient's full clinical picture (only entered data is analyzed)
- Rare drug interactions not in the knowledge base
- Patient-specific pharmacokinetics
- Comorbidities not documented in the system
- Contraindications requiring specialist knowledge

### Standard Disclaimer (shown with every suggestion)

> *"These are AI-generated suggestions for clinical assistance only. They do not constitute a diagnosis. The treating doctor must independently evaluate and make all clinical decisions."*

---

## 6. Knowledge Base Maintenance

The AI knowledge base (`clinical-knowledge.data.ts`) must be reviewed:

| Component | Review Frequency | Responsible |
|---|---|---|
| ICD-10 symptom rules | Annual (with ICD updates) | Clinical IT + Medical Officer |
| Drug interaction database | Quarterly | Pharmacist + Clinical IT |
| Vital thresholds | Annual | Medical Director |
| Allergy patterns | Bi-annual | Clinical IT |

---

## 7. Regulatory Alignment

This AI system is designed to align with:

- **CDSCO Guidelines** on Software as Medical Device (SaMD) — AI is advisory, not diagnostic
- **DPDP Act 2023** — patient data stays on-premise
- **NABH Standards** — clinical audit trail maintained
- **HIPAA-equivalent** data isolation (branch-scoped, no cross-branch leakage)

---

## 8. Future ML Roadmap (Phase 20+)

If future versions incorporate ML models, they must:
1. Be validated on Indian clinical data before deployment
2. Pass internal clinical review committee approval
3. Have explainability (LIME/SHAP or equivalent)
4. Be isolated from the core clinical transaction path
5. Maintain the same immutable audit log architecture
