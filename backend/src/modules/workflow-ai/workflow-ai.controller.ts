import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { WorkflowAiService } from './workflow-ai.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@Controller('workflow-ai')
@UseGuards(JwtAuthGuard, TenantGuard)
export class WorkflowAiController {
  constructor(private readonly workflowService: WorkflowAiService) {}

  @Post('trigger')
  async triggerRule(@Body() body: { triggerType: string, payload: any }) {
    return this.workflowService.triggerWorkflow(body.triggerType, body.payload);
  }

  @Get('tasks')
  async getPendingTasks() {
    return this.workflowService.getTasks();
  }
}
