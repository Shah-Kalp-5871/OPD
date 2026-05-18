import { Module } from '@nestjs/common';
import { EpharmacyService } from './epharmacy.service';
import { EpharmacyController } from './epharmacy.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EpharmacyService],
  controllers: [EpharmacyController],
  exports: [EpharmacyService],
})
export class EpharmacyModule {}
