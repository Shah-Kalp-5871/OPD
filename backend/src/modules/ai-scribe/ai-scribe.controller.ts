import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AiScribeService } from './ai-scribe.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/v2/ai-scribe')
@UseGuards(JwtAuthGuard)
export class AiScribeController {
  constructor(private readonly aiScribeService: AiScribeService) {}

  @Post(':tenantId/sessions')
  createSession(
    @Param('tenantId') tenantId: string,
    @Body() body: { doctorId: string; patientId: string; encounterId?: string },
  ) {
    return this.aiScribeService.createSession(tenantId, body.doctorId, body.patientId, body.encounterId);
  }

  @Post(':tenantId/sessions/:sessionId/segments')
  addSegment(
    @Param('sessionId') sessionId: string,
    @Body() body: { speaker: string; text: string; startMs: number; endMs: number; confidence?: number },
  ) {
    return this.aiScribeService.addSegment(sessionId, body.speaker, body.text, body.startMs, body.endMs, body.confidence);
  }

  @Post(':tenantId/sessions/:sessionId/process')
  processSoapNote(@Param('tenantId') tenantId: string, @Param('sessionId') sessionId: string) {
    return this.aiScribeService.processSoapNote(tenantId, sessionId);
  }

  @Patch(':tenantId/sessions/:sessionId/approve')
  approveSession(
    @Param('tenantId') tenantId: string,
    @Param('sessionId') sessionId: string,
    @Body() body: { doctorId: string },
  ) {
    return this.aiScribeService.approveSession(tenantId, sessionId, body.doctorId);
  }

  @Get(':tenantId/sessions/:sessionId')
  getSession(@Param('tenantId') tenantId: string, @Param('sessionId') sessionId: string) {
    return this.aiScribeService.getSession(tenantId, sessionId);
  }

  @Get(':tenantId/sessions')
  getSessions(@Param('tenantId') tenantId: string) {
    return this.aiScribeService.getSessions(tenantId);
  }
}
