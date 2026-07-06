import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BillingModule } from '../billing/billing.module';
import { CommonModule } from '../common/common.module';
import { ConsultationLockService } from './consultation-lock.service';

@Module({
  imports: [PrismaModule, BillingModule, CommonModule],
  providers: [ConsultationService, ConsultationLockService],
  controllers: [ConsultationController],
})
export class ConsultationModule {}
