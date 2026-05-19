import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { PatientCopilotService } from './services/patient-copilot.service';
import { SymptomTriageService } from './services/symptom-triage.service';

@Controller('consumer-ai')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ConsumerAiController {
  constructor(
    private readonly copilotService: PatientCopilotService,
    private readonly triageService: SymptomTriageService,
  ) {}

  @Post('chat')
  async askCopilot(@Body() body: any) {
    return this.copilotService.askCopilot(
      body.patientId || 'default-patient',
      body.prompt,
    );
  }

  @Post('triage')
  async assessSymptoms(@Body() body: any) {
    return this.triageService.assessSymptoms(
      body.patientId || 'default-patient',
      body.symptoms,
    );
  }
}