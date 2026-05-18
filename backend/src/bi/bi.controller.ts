import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
  Res,
  SetMetadata,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { BiService } from './bi.service';
import { BiDataMartService } from './bi-data-mart.service';
import { BiExportService } from './bi-export.service';
import { BiFilterDto, ExportRequestDto } from './dto/bi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

@Controller('bi')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.BRANCH_ADMIN) // restricted strictly to executives and managers
export class BiController {
  constructor(
    private readonly biService: BiService,
    private readonly dataMart: BiDataMartService,
    private readonly exportService: BiExportService,
  ) {}

  /**
   * Helper to restrict query scope based on user's authorized branches.
   */
  private enforceBranchScope(user: any, filter: BiFilterDto): void {
    const isGlobalExecutive = [Role.SUPERADMIN, Role.ADMIN].includes(user.role);
    if (!isGlobalExecutive) {
      // For branch admins, force filter scope to match their designated primary branch
      if (!user.primaryBranchId) {
        throw new ForbiddenException('User is not assigned to any primary branch.');
      }
      filter.branchId = user.primaryBranchId;
    }
  }

  @Get('executive-overview')
  async getExecutiveOverview(@Req() req: any, @Query() filter: BiFilterDto) {
    this.enforceBranchScope(req.user, filter);
    return this.biService.getExecutiveOverview(filter, req.user.id);
  }

  @Get('revenue')
  async getRevenueTrends(@Req() req: any, @Query() filter: BiFilterDto) {
    this.enforceBranchScope(req.user, filter);
    return this.biService.getRevenueTrends(filter);
  }

  @Get('forecasting')
  async getForecasting(@Req() req: any, @Query() filter: BiFilterDto) {
    this.enforceBranchScope(req.user, filter);
    return this.biService.getForecasting(filter);
  }

  @Get('doctor-performance')
  async getDoctorPerformance(@Req() req: any, @Query() filter: BiFilterDto) {
    this.enforceBranchScope(req.user, filter);
    return this.biService.getDoctorPerformance(filter);
  }

  @Get('branch-comparison')
  @Roles(Role.SUPERADMIN, Role.ADMIN) // strict global overview restriction
  async getBranchComparison() {
    return this.biService.getBranchComparison();
  }

  @Get('patient-trends')
  async getPatientTrends(@Req() req: any, @Query() filter: BiFilterDto) {
    this.enforceBranchScope(req.user, filter);
    return this.biService.getPatientTrends(filter);
  }

  @Get('operational-monitoring')
  async getOperationalMonitoring() {
    return this.biService.getOperationalMonitoring();
  }

  /**
   * Trigger manually materialized snapshot generation across all layers.
   */
  @Post('datamart/materialize')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async manualMaterialize() {
    await this.dataMart.forceMaterializeAll();
    return { success: true, message: 'Materialized snapshots rebuilt successfully.' };
  }

  /**
   * Dispatches and compiles export requests.
   */
  @Post('export')
  async requestExport(@Req() req: any, @Body() dto: ExportRequestDto) {
    // Cast query properties to fit filters
    const filter = new BiFilterDto();
    filter.branchId = dto.branchId;
    this.enforceBranchScope(req.user, filter);
    dto.branchId = filter.branchId;

    return this.exportService.requestReportExport(dto, req.user.id);
  }

  /**
   * Unprotected direct tokenized download endpoint.
   */
  @Get('export/download/:fileName')
  async downloadReport(
    @Param('fileName') fileName: string,
    @Query('token') token: string,
    @Res() res: any,
  ) {
    if (!token) {
      throw new BadRequestException('Security validation token is required.');
    }

    const filePath = path.join(process.cwd(), 'scratch', 'exports', fileName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Requested export file not found or expired.');
    }

    res.download(filePath);
  }
}
