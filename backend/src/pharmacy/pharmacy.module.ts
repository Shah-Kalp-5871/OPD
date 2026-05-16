import { Module } from '@nestjs/common';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [PrismaModule, CommonModule, BillingModule],
  controllers: [PharmacyController],
  providers: [PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
