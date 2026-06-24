import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.queueHistory.deleteMany();
  await prisma.queueCall.deleteMany();
  await prisma.queueEntry.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patientCase.deleteMany();
  console.log('Cleared appointments and queues');
}
main().finally(() => prisma.$disconnect());
