-- Add MedicalRepresentative support to QueueEntry
-- Adds mrId and mrVisitId columns so MR visits can be tracked in the queue.
-- Uses IF NOT EXISTS to be safe on databases where these columns already exist (e.g. dev).

ALTER TABLE "QueueEntry"
ADD COLUMN IF NOT EXISTS "mrId" TEXT,
ADD COLUMN IF NOT EXISTS "mrVisitId" TEXT;

-- Add unique constraint on mrVisitId (one QueueEntry per MR visit)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'QueueEntry_mrVisitId_key'
  ) THEN
    ALTER TABLE "QueueEntry" ADD CONSTRAINT "QueueEntry_mrVisitId_key" UNIQUE ("mrVisitId");
  END IF;
END
$$;

-- Create MedicalRepresentative table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS "MedicalRepresentative" (
  "id"          TEXT NOT NULL,
  "firstName"   TEXT NOT NULL,
  "lastName"    TEXT NOT NULL,
  "mobile"      TEXT NOT NULL,
  "companyName" TEXT,
  "isActive"    BOOLEAN NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MedicalRepresentative_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "MedicalRepresentative_mobile_key" ON "MedicalRepresentative"("mobile");

-- Create MrVisit table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS "MrVisit" (
  "id"        TEXT NOT NULL,
  "mrId"      TEXT NOT NULL,
  "doctorId"  TEXT NOT NULL,
  "branchId"  TEXT NOT NULL,
  "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status"    TEXT NOT NULL DEFAULT 'OPEN',
  "notes"     TEXT,
  CONSTRAINT "MrVisit_pkey" PRIMARY KEY ("id")
);

-- Add FK constraints only if the referenced tables exist and constraints don't already exist
DO $$
BEGIN
  -- QueueEntry -> MedicalRepresentative
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'QueueEntry_mrId_fkey'
  ) THEN
    ALTER TABLE "QueueEntry"
    ADD CONSTRAINT "QueueEntry_mrId_fkey"
    FOREIGN KEY ("mrId") REFERENCES "MedicalRepresentative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  -- QueueEntry -> MrVisit
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'QueueEntry_mrVisitId_fkey'
  ) THEN
    ALTER TABLE "QueueEntry"
    ADD CONSTRAINT "QueueEntry_mrVisitId_fkey"
    FOREIGN KEY ("mrVisitId") REFERENCES "MrVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  -- MrVisit -> MedicalRepresentative
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'MrVisit_mrId_fkey'
  ) THEN
    ALTER TABLE "MrVisit"
    ADD CONSTRAINT "MrVisit_mrId_fkey"
    FOREIGN KEY ("mrId") REFERENCES "MedicalRepresentative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  -- MrVisit -> User (doctor)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'MrVisit_doctorId_fkey'
  ) THEN
    ALTER TABLE "MrVisit"
    ADD CONSTRAINT "MrVisit_doctorId_fkey"
    FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON UPDATE CASCADE;
  END IF;

  -- MrVisit -> Branch
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'MrVisit_branchId_fkey'
  ) THEN
    ALTER TABLE "MrVisit"
    ADD CONSTRAINT "MrVisit_branchId_fkey"
    FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON UPDATE CASCADE;
  END IF;
END
$$;

-- Add mrVisits relation column on User table (mrVisits tracked via MrVisit.doctorId)
-- No schema change needed on User, it's a virtual relation in Prisma.

-- Index for MrVisit lookup by mr
CREATE INDEX IF NOT EXISTS "MrVisit_mrId_idx" ON "MrVisit"("mrId");
