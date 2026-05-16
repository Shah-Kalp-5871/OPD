-- Phase 3 file upload metadata. These columns already exist in schema.prisma;
-- this migration keeps the database aligned without changing document ownership.
ALTER TABLE "ClinicalImage"
ADD COLUMN IF NOT EXISTS "mimeType" TEXT,
ADD COLUMN IF NOT EXISTS "storedPath" TEXT,
ADD COLUMN IF NOT EXISTS "sha256Hash" TEXT;

ALTER TABLE "InvestigationFile"
ADD COLUMN IF NOT EXISTS "mimeType" TEXT,
ADD COLUMN IF NOT EXISTS "storedPath" TEXT,
ADD COLUMN IF NOT EXISTS "sha256Hash" TEXT;

ALTER TABLE "ConsentForm"
ADD COLUMN IF NOT EXISTS "mimeType" TEXT,
ADD COLUMN IF NOT EXISTS "storedPath" TEXT,
ADD COLUMN IF NOT EXISTS "sha256Hash" TEXT;
