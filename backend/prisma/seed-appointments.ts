import { PrismaClient, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding appointments for today...');

  const patient = await prisma.patient.findFirst();
  const doctor = await prisma.doctorProfile.findFirst();
  const branch = await prisma.branch.findFirst();

  if (!patient || !doctor || !branch) {
    console.error('Missing required data (patient, doctor, branch) in DB. Run seed.ts first.');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const time1 = new Date();
  time1.setHours(10, 30, 0, 0);

  const time2 = new Date();
  time2.setHours(11, 45, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      branchId: branch.id,
      appointmentDate: today,
      appointmentTime: time1,
      purpose: 'Follow Up',
      status: 'SCHEDULED'
    }
  });

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      branchId: branch.id,
      appointmentDate: today,
      appointmentTime: time2,
      purpose: 'Routine Checkup',
      status: 'SCHEDULED'
    }
  });

  console.log('Successfully seeded 2 scheduled appointments for today.');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
