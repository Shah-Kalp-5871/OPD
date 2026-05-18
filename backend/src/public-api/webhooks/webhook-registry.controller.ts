import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Scopes } from '../auth/scopes.decorator';
import { WebhookCatalogService } from './webhook-catalog.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { Permissions } from '../../auth/permissions.decorator';
import { TenantGuard } from '../../modules/tenancy/guards/tenant.guard';

@Controller('api/v2/webhooks/registry')
export class WebhookRegistryController {
  constructor(private readonly catalog: WebhookCatalogService) {}

  @Get('events')
  getEventCatalog() {
    return { events: this.catalog.getCatalog() };
  }

  @Get('deliveries')
  @UseGuards(ApiKeyGuard)
  @Scopes('webhooks:read')
  listDeliveries(@Req() req: { clientId: string }, @Query('status') status?: string) {
    return this.catalog.listDeliveries(req.clientId, status);
  }

  @Get('dead-letter')
  @UseGuards(ApiKeyGuard)
  @Scopes('webhooks:read')
  deadLetter(@Req() req: { clientId: string }) {
    return this.catalog.listDeadLetter(req.clientId);
  }

  @Post('deliveries/:id/replay')
  @UseGuards(ApiKeyGuard)
  @Scopes('webhooks:write')
  replay(@Req() req: { clientId: string }, @Param('id') id: string) {
    return this.catalog.replayDelivery(id, req.clientId);
  }
}

@Controller('admin/webhooks')
@UseGuards(JwtAuthGuard, PermissionsGuard, TenantGuard)
export class WebhookAdminController {
  constructor(private readonly catalog: WebhookCatalogService) {}

  @Get('catalog')
  @Permissions('API_MANAGE', 'SYSTEM_ADMIN')
  catalogEvents() {
    return { events: this.catalog.getCatalog() };
  }
}
