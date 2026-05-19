import { Controller, Get, Post, Body, UseGuards, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { PatientMessagingService } from './services/patient-messaging.service';
import { NotificationOrchestratorService } from './services/notification-orchestrator.service';

@Controller('consumer-communication')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ConsumerCommunicationController {
  constructor(
    private readonly messagingService: PatientMessagingService,
    private readonly orchestratorService: NotificationOrchestratorService,
  ) {}

  @Get('inbox')
  async getInbox(@Query('patientId') patientId: string) {
    return this.messagingService.getInbox(patientId || 'default-patient');
  }

  @Post('inbox/:id/read')
  async markAsRead(@Param('id') id: string) {
    return this.messagingService.markAsRead(id);
  }

  @Post('send')
  async sendMessage(@Body() body: any) {
    return this.messagingService.sendMessage(body.patientId || 'default-patient', body.channel, body.body, body.subject);
  }

  @Get('campaigns')
  async getCampaigns() {
    return this.orchestratorService.getCampaigns();
  }

  @Post('campaigns/trigger')
  async triggerCampaign(@Body() body: any) {
    return this.orchestratorService.triggerCampaign(body.campaignName, body.channel, body.body);
  }
}