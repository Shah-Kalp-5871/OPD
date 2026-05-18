import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { Permissions } from '../../auth/permissions.decorator';
import { TenantGuard } from '../../modules/tenancy/guards/tenant.guard';
import { TenantContextService } from '../../modules/tenancy/tenant-context.service';
import { ApiUsageService } from './api-usage.service';

@Controller('admin/api-usage')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantGuard)
export class ApiUsageController {
  constructor(
    private readonly usageService: ApiUsageService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Get('analytics')
  @Permissions('API_MANAGE', 'ANALYTICS_VIEW', 'SYSTEM_ADMIN')
  tenantAnalytics() {
    return this.usageService.getTenantUsageAnalytics(
      this.tenantContext.getTenantId()!,
    );
  }

  @Get('clients/:clientId')
  @Permissions('API_MANAGE', 'SYSTEM_ADMIN')
  clientSummary(@Param('clientId') clientId: string) {
    return this.usageService.getClientUsageSummary(clientId);
  }
}
