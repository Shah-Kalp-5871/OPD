ALTER TABLE "AppointmentStatusHistory"
ADD COLUMN IF NOT EXISTS "previousStatus" "AppointmentStatus";

CREATE INDEX IF NOT EXISTS "Appointment_doctorId_appointmentDate_idx"
ON "Appointment" ("doctorId", "appointmentDate");

CREATE INDEX IF NOT EXISTS "Appointment_status_idx"
ON "Appointment" ("status");

CREATE INDEX IF NOT EXISTS "QueueEntry_status_checkInTime_idx"
ON "QueueEntry" ("status", "checkInTime");
