import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueEntryDto } from './dto/create-queue-entry.dto';
import {
  UpdateQueueStatusDto,
  UpdateCaseStageDto,
} from './dto/update-queue.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BranchGuard } from '../auth/branch.guard';
import { BranchId } from '../auth/branch-id.decorator';

@Controller('queue')
@UseGuards(JwtAuthGuard, RolesGuard, BranchGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('check-in')
  @Roles('RECEPTION', 'ADMIN')
  async checkIn(
    @Body() dto: CreateQueueEntryDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.queueService.createEntry(dto, req.user.id, branchId);
  }

  @Patch(':id/status')
  @Roles('RECEPTION', 'DOCTOR', 'ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateQueueStatusDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.queueService.updateStatus(id, dto, req.user.id, branchId);
  }

  @Patch('case/:caseId/stage')
  @Roles('DOCTOR', 'ADMIN')
  async updateStage(
    @Param('caseId') caseId: string,
    @Body() dto: UpdateCaseStageDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.queueService.updateStage(caseId, dto, req.user.id, branchId);
  }

  @Post('session/start')
  @Roles('DOCTOR', 'ADMIN')
  async startSession(
    @Body('caseId') caseId: string,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.queueService.startSession(
      caseId,
      req.user.id,
      req.user.id,
      branchId,
    );
  }

  @Post('session/end')
  @Roles('DOCTOR', 'ADMIN')
  async endSession(
    @Body('caseId') caseId: string,
    @Body('nextStage') nextStage: any,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.queueService.endSession(
      caseId,
      req.user.id,
      nextStage || 'BILLING',
      branchId,
    );
  }

  @Get('live')
  @Roles('RECEPTION', 'DOCTOR', 'ADMIN')
  async getLiveQueue(
    @Query('doctorId') doctorId: string | undefined,
    @BranchId() branchId: string,
  ) {
    return this.queueService.getLiveQueue(branchId, doctorId);
  }

  @Get('stats')
  @Roles('RECEPTION', 'DOCTOR', 'ADMIN')
  async getStats(@BranchId() branchId: string) {
    return this.queueService.getStats(branchId);
  }
}
