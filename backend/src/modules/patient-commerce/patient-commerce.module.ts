import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PatientBillingService } from './services/patient-billing.service';
import { ConsumerPaymentsService } from './services/consumer-payments.service';
import { PatientCommerceController } from './patient-commerce.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [PatientBillingService, ConsumerPaymentsService],
  controllers: [PatientCommerceController],
  exports: [PatientBillingService, ConsumerPaymentsService],
})
export class PatientCommerceModule {}