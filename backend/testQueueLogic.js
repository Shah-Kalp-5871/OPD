const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const branchId = '28bc4539-7835-4dbb-b27e-8557b77ce294';
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  
  console.log(`Querying queue entries with checkInTime >= ${startOfDay.toISOString()}`);

  const liveQueue = await prisma.queueEntry.findMany({
    where: {
      branchId,
      checkInTime: { gte: startOfDay },
      status: { not: 'CANCELLED' },
    },
    include: {
      patient: true,
      case: true
    }
  });

  console.log(`Live Queue has ${liveQueue.length} entries.`);
  liveQueue.forEach(q => {
    console.log(`- ID: ${q.id}, Status: ${q.status}, CheckIn: ${q.checkInTime.toISOString()}, Patient: ${q.patient?.firstName}`);
  });

  const waitingEntries = await prisma.queueEntry.findMany({
    where: { status: 'WAITING' },
    include: { patient: true }
  });

  console.log(`\nTotal WAITING entries in DB: ${waitingEntries.length}`);
  waitingEntries.forEach(q => {
    console.log(`- ID: ${q.id}, CheckIn: ${q.checkInTime.toISOString()}, >= startOfDay? ${q.checkInTime >= startOfDay}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
