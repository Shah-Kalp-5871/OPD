const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const queue = await prisma.queueEntry.findMany({ include: { case: true } });
  console.log(JSON.stringify(queue, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
