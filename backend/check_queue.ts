import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const entries = await prisma.queueEntry.findMany({
    where: {
      checkInTime: { gte: new Date(new Date().setHours(0,0,0,0)) }
    },
    include: {
      patient: true,
      case: true
    }
  });
  console.log('Today entries:', JSON.stringify(entries, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
