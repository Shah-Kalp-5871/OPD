import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('consultation')
@UseGuards(JwtAuthGuard)
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Get(':caseId')
  async getConsultation(@Param('caseId') caseId: string, @Request() req) {
    return this.consultationService.getOrCreateConsultation(caseId, req.user.userId);
  }

  @Post(':caseId/save')
  async saveConsultation(
    @Param('caseId') caseId: string,
    @Body() data: any
  ) {
    return this.consultationService.updateConsultation(caseId, data);
  }
}
