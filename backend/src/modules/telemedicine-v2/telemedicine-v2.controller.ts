import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TelemedicineV2Service } from './telemedicine-v2.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/v2/telemedicine')
@UseGuards(JwtAuthGuard)
export class TelemedicineV2Controller {
  constructor(private readonly service: TelemedicineV2Service) {}

  @Post(':tenantId/sessions')
  createSession(
    @Param('tenantId') tenantId: string,
    @Body() body: { patientId: string; doctorId: string; recordingConsent?: boolean },
  ) {
    return this.service.createSession(tenantId, body.patientId, body.doctorId, body.recordingConsent);
  }

  @Patch(':tenantId/sessions/:sessionId/start')
  startSession(@Param('tenantId') tenantId: string, @Param('sessionId') sessionId: string) {
    return this.service.startSession(tenantId, sessionId);
  }

  @Patch(':tenantId/sessions/:sessionId/end')
  endSession(@Param('tenantId') tenantId: string, @Param('sessionId') sessionId: string) {
    return this.service.endSession(tenantId, sessionId);
  }

  @Post(':tenantId/sessions/:sessionId/join')
  joinSession(@Param('sessionId') sessionId: string, @Body() body: { userId: string; role: string }) {
    return this.service.joinSession(sessionId, body.userId, body.role);
  }

  @Post(':tenantId/sessions/:sessionId/leave')
  leaveSession(@Param('sessionId') sessionId: string, @Body() body: { userId: string }) {
    return this.service.leaveSession(sessionId, body.userId);
  }

  @Get(':tenantId/sessions/:sessionId')
  getSession(@Param('tenantId') tenantId: string, @Param('sessionId') sessionId: string) {
    return this.service.getSession(tenantId, sessionId);
  }

  @Get(':tenantId/sessions')
  getSessions(@Param('tenantId') tenantId: string) {
    return this.service.getSessions(tenantId);
  }

  @Get('turn-credentials')
  getTurnCredentials() {
    return this.service.generateTurnCredentials();
  }
}
