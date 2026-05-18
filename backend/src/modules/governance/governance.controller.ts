import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GovernanceService } from './governance.service';
import { LogPhiAccessDto, CreateRetentionPolicyDto } from './dto/governance.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Permissions } from '../../auth/permissions.decorator';

@Controller('api/v2/governance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Post(':tenantId/phi-access')
  logPhiAccess(@Param('tenantId') tenantId: string, @Body() dto: LogPhiAccessDto) {
    return this.governanceService.logPhiAccess(tenantId, dto);
  }

  @Get(':tenantId/phi-access')
  @Permissions('SYSTEM_ADMIN')
  getPhiAccessLogs(@Param('tenantId') tenantId: string, @Query('patientId') patientId?: string) {
    return this.governanceService.getPhiAccessLogs(tenantId, patientId);
  }

  @Post(':tenantId/retention-policies')
  @Permissions('SYSTEM_ADMIN')
  createRetentionPolicy(@Param('tenantId') tenantId: string, @Body() dto: CreateRetentionPolicyDto) {
    return this.governanceService.createRetentionPolicy(tenantId, dto);
  }

  @Get(':tenantId/retention-policies')
  @Permissions('SYSTEM_ADMIN')
  getRetentionPolicies(@Param('tenantId') tenantId: string) {
    return this.governanceService.getRetentionPolicies(tenantId);
  }
}
