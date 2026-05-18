import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { Permissions } from '../../auth/permissions.decorator';
import { TenantGuard } from '../../modules/tenancy/guards/tenant.guard';
import { TenantContextService } from '../../modules/tenancy/tenant-context.service';
import { ApiClientAdminService } from './api-client-admin.service';

@Controller('admin/api-clients')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantGuard)
export class ApiClientAdminController {
  constructor(
    private readonly adminService: ApiClientAdminService,
    private readonly tenantContext: TenantContextService,
  ) {}

  @Get()
  @Permissions('API_MANAGE', 'SYSTEM_ADMIN')
  list() {
    const tenantId = this.tenantContext.getTenantId();
    return this.adminService.listClients(tenantId!);
  }

  @Get(':clientId')
  @Permissions('API_MANAGE', 'SYSTEM_ADMIN')
  detail(@Param('clientId') clientId: string) {
    return this.adminService.getClientDetail(
      this.tenantContext.getTenantId()!,
      clientId,
    );
  }

  @Post()
  @Permissions('API_MANAGE', 'SYSTEM_ADMIN')
  create(
    @Body()
    body: {
      name: string;
      scopes: string[];
      environment?: 'production' | 'sandbox';
      branchId?: string;
      rateLimitPerMinute?: number;
      monthlyQuota?: number;
    },
  ) {
    return this.adminService.createClient({
      ...body,
      tenantId: this.tenantContext.getTenantId()!,
    });
  }

  @Patch(':clientId')
  @Permissions('API_MANAGE', 'SYSTEM_ADMIN')
  update(
    @Param('clientId') clientId: string,
    @Body()
    body: {
      name?: string;
      scopes?: string[];
      environment?: string;
      isActive?: boolean;
      branchId?: string | null;
      rateLimitPerMinute?: number;
      monthlyQuota?: number;
    },
  ) {
    return this.adminService.updateClient(
      this.tenantContext.getTenantId()!,
      clientId,
      body,
    );
  }

  @Post(':clientId/rotate-key')
  @Permissions('API_MANAGE', 'SYSTEM_ADMIN')
  rotateKey(@Param('clientId') clientId: string) {
    return this.adminService.rotateKey(
      this.tenantContext.getTenantId()!,
      clientId,
    );
  }

  @Post(':clientId/revoke-key')
  @Permissions('API_MANAGE', 'SYSTEM_ADMIN')
  revokeKey(@Param('clientId') clientId: string) {
    return this.adminService.revokeKey(
      this.tenantContext.getTenantId()!,
      clientId,
    );
  }
}
