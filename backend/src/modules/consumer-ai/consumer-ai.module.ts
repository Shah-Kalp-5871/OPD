import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { PatientCopilotService } from './services/patient-copilot.service';
import { SymptomTriageService } from './services/symptom-triage.service';
import { ConsumerAiController } from './consumer-ai.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [PatientCopilotService, SymptomTriageService],
  controllers: [ConsumerAiController],
  exports: [PatientCopilotService, SymptomTriageService],
})
export class ConsumerAiModule {}