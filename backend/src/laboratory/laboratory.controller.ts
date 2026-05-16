import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import {
  UpdateInvestigationStatusDto,
  SubmitLabResultsDto,
} from './dto/laboratory.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BranchId } from '../common/decorators/branch-id.decorator';
import { BranchGuard } from '../common/guards/branch.guard';

@Controller('laboratory')
@UseGuards(JwtAuthGuard, RolesGuard, BranchGuard)
export class LaboratoryController {
  constructor(private readonly labService: LaboratoryService) {}

  @Get('pending')
  @Roles('LAB_TECHNICIAN', 'ADMIN')
  getPending(@BranchId() branchId: string) {
    return this.labService.getPendingInvestigations(branchId);
  }

  @Get('order/:id')
  @Roles('LAB_TECHNICIAN', 'ADMIN', 'DOCTOR')
  getOrder(@Param('id') id: string, @BranchId() branchId: string) {
    return this.labService.getOrderDetails(id, branchId);
  }

  @Put('order/:id/status')
  @Roles('LAB_TECHNICIAN', 'ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInvestigationStatusDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.labService.updateStatus(id, dto, req.user.id, branchId);
  }

  @Post('order/:id/results')
  @Roles('LAB_TECHNICIAN', 'ADMIN')
  submitResults(
    @Param('id') id: string,
    @Body() dto: SubmitLabResultsDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.labService.submitResults(id, dto, req.user.id, branchId);
  }
}
