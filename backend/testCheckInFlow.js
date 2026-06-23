const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const branchId = '28bc4539-7835-4dbb-b27e-8557b77ce294';
  
  // 1. Create a dummy patient
  const patient = await prisma.patient.create({
    data: {
      firstName: 'Test',
      lastName: 'Arrived',
      mobile: '9999999999',
      branchId,
    }
  });

  // 2. Create an appointment
  const doctor = await prisma.doctor.findFirst({ include: { user: true } });
  
  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      branchId,
      appointmentDate: new Date(),
      appointmentTime: new Date(),
      status: 'SCHEDULED',
      purpose: 'Consultation'
    }
  });
  
  console.log('Created appointment', appointment.id);

  // 3. Simulate check-in (what the service does)
  const patientCase = await prisma.patientCase.create({
    data: {
      patientId: patient.id,
      branchId,
      caseNumber: 'CASE-TEST',
      stage: 'NURSING',
      doctorId: doctor.userId,
    }
  });
  
  const queueEntry = await prisma.queueEntry.create({
    data: {
      tokenDisplay: 'TEST-1',
      tokenNumber: 1,
      queueType: 'OPD',
      priority: 'NORMAL',
      caseId: patientCase.id,
      patientId: patient.id,
      doctorId: doctor.userId,
      branchId,
      status: 'WAITING',
      checkInTime: new Date()
    }
  });
  
  console.log('Created queue entry', queueEntry.id, 'checkInTime', queueEntry.checkInTime);
  
  // 4. Test live queue logic
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const liveQueue = await prisma.queueEntry.findMany({
    where: {
      branchId,
      checkInTime: { gte: startOfDay },
      status: { not: 'CANCELLED' },
    }
  });
  
  console.log('Live Queue length:', liveQueue.length);
  const found = liveQueue.find(q => q.id === queueEntry.id);
  console.log('Found newly checked in entry?', !!found);

}

main().catch(console.error).finally(() => prisma.$disconnect());
