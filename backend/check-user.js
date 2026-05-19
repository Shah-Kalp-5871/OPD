const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email: 'admin@clinic.com' },
  });
  console.log('User from DB:', JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
