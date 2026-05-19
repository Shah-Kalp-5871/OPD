import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PatientMessagingService } from './services/patient-messaging.service';
import { NotificationOrchestratorService } from './services/notification-orchestrator.service';
import { ConsumerCommunicationController } from './consumer-communication.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [PatientMessagingService, NotificationOrchestratorService],
  controllers: [ConsumerCommunicationController],
  exports: [PatientMessagingService, NotificationOrchestratorService],
})
export class ConsumerCommunicationModule {}