/*
  Warnings:

  - You are about to drop the column `shift` on the `ReceptionProfile` table. All the data in the column will be lost.
  - Made the column `consultationFee` on table `DoctorProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DoctorProfile" ADD COLUMN     "appointmentGap" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "availableDays" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "eveningEnd" TEXT,
ADD COLUMN     "eveningStart" TEXT,
ADD COLUMN     "morningEnd" TEXT,
ADD COLUMN     "morningStart" TEXT,
ADD COLUMN     "slotDuration" INTEGER NOT NULL DEFAULT 15,
ALTER COLUMN "consultationFee" SET NOT NULL;

-- AlterTable
ALTER TABLE "MedicalProfile" ADD COLUMN     "overtimeRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "salary" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "NurseProfile" ADD COLUMN     "overtimeRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "salary" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "ReceptionProfile" DROP COLUMN "shift",
ADD COLUMN     "overtimeRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "salary" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
