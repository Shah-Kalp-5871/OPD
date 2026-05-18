import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RegionalizationService } from './regionalization.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Permissions } from '../../auth/permissions.decorator';

@Controller('api/v2/regionalization')
@UseGuards(JwtAuthGuard)
export class RegionalizationController {
  constructor(private readonly service: RegionalizationService) {}

  @Post(':tenantId/policies')
  @Permissions('SYSTEM_ADMIN')
  createPolicy(
    @Param('tenantId') tenantId: string,
    @Body() body: { countryCode: string; policyType: string; rules: Record<string, any>; region?: string; effectiveTo?: string },
  ) {
    return this.service.createPolicy(tenantId, body.countryCode, body.policyType, body.rules, body.region, body.effectiveTo ? new Date(body.effectiveTo) : undefined);
  }

  @Get(':tenantId/policies')
  getPolicies(@Param('tenantId') tenantId: string, @Query('countryCode') countryCode?: string) {
    return this.service.getPolicies(tenantId, countryCode);
  }

  @Patch(':tenantId/policies/:policyId/deactivate')
  @Permissions('SYSTEM_ADMIN')
  deactivatePolicy(@Param('tenantId') tenantId: string, @Param('policyId') policyId: string) {
    return this.service.deactivatePolicy(tenantId, policyId);
  }

  @Post(':tenantId/consent')
  recordConsent(
    @Param('tenantId') tenantId: string,
    @Body() body: { patientId: string; type: string; granted: boolean; ipAddress?: string; userAgent?: string },
  ) {
    return this.service.recordConsent(tenantId, body.patientId, body.type, body.granted, body.ipAddress, body.userAgent);
  }

  @Get(':tenantId/consent/:patientId')
  getConsents(@Param('tenantId') tenantId: string, @Param('patientId') patientId: string) {
    return this.service.getConsents(tenantId, patientId);
  }
}
