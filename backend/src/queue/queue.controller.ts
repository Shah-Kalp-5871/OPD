import { Controller, Post, Patch, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueEntryDto } from './dto/create-queue-entry.dto';
import { UpdateQueueStatusDto, UpdateCaseStageDto } from './dto/update-queue.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('queue')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('check-in')
  @Roles('RECEPTION', 'ADMIN')
  async checkIn(@Body() dto: CreateQueueEntryDto, @Request() req) {
    return this.queueService.createEntry(dto, req.user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateQueueStatusDto,
    @Request() req
  ) {
    return this.queueService.updateStatus(id, dto, req.user.id);
  }

  @Patch('case/:caseId/stage')
  async updateStage(
    @Param('caseId') caseId: string,
    @Body() dto: UpdateCaseStageDto,
    @Request() req
  ) {
    return this.queueService.updateStage(caseId, dto, req.user.id);
  }

  @Post('session/start')
  @Roles('DOCTOR', 'ADMIN')
  async startSession(@Body('caseId') caseId: string, @Request() req) {
    return this.queueService.startSession(caseId, req.user.id, req.user.id);
  }

  @Post('session/end')
  @Roles('DOCTOR', 'ADMIN')
  async endSession(
    @Body('caseId') caseId: string,
    @Body('nextStage') nextStage: any,
    @Request() req
  ) {
    return this.queueService.endSession(caseId, req.user.id, nextStage || 'BILLING');
  }

  @Get('live')
  async getLiveQueue(@Query('doctorId') doctorId?: string) {
    return this.queueService.getLiveQueue(doctorId);
  }

  @Get('stats')
  async getStats() {
    return this.queueService.getStats();
  }
}
