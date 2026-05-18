import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { KnowledgeCopilotService } from './knowledge-copilot.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@Controller('knowledge-copilot')
@UseGuards(JwtAuthGuard, TenantGuard)
export class KnowledgeCopilotController {
  constructor(private readonly copilotService: KnowledgeCopilotService) {}

  @Post('ask')
  async askQuery(@Body() body: { userId: string, query: string }) {
    return this.copilotService.askQuestion(body.userId, body.query);
  }

  @Post('documents')
  async uploadDoc(@Body() body: { title: string, content: string, category: string }) {
    return this.copilotService.uploadDocument(body.title, body.content, body.category);
  }

  @Get('dashboard')
  async getDashboard() {
    return this.copilotService.getDashboardData();
  }
}
