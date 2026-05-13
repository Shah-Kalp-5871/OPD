import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.update({
    where: { email: 'admin@opd.com' },
    data: { password: hashedPassword }
  });
  console.log('Password reset successfully');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
