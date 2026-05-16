CREATE INDEX IF NOT EXISTS "Bill_paymentStatusEnum_billingDate_idx"
ON "Bill" ("paymentStatusEnum", "billingDate");

CREATE INDEX IF NOT EXISTS "Bill_caseId_idx"
ON "Bill" ("caseId");

CREATE INDEX IF NOT EXISTS "BillPayment_billId_idx"
ON "BillPayment" ("billId");
