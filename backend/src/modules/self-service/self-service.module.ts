import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PatientBookingService } from './services/patient-booking.service';
import { QueueExperienceService } from './services/queue-experience.service';
import { SelfServiceController } from './self-service.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [PatientBookingService, QueueExperienceService],
  controllers: [SelfServiceController],
  exports: [PatientBookingService, QueueExperienceService],
})
export class SelfServiceModule {}