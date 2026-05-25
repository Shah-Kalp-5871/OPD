import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bills = await prisma.bill.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log('Recent Bills:');
  console.log(bills);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
