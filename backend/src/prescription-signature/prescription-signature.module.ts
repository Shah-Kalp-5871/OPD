import { Module } from '@nestjs/common';
import { PrescriptionSignatureService } from './prescription-signature.service';
import { PrescriptionSignatureController } from './prescription-signature.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PrescriptionSignatureService],
  controllers: [PrescriptionSignatureController],
  exports: [PrescriptionSignatureService],
})
export class PrescriptionSignatureModule {}
