import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { EdgeRoutingService } from './services/edge-routing.service';
import { GeoDnsService } from './services/geo-dns.service';
import { WafEdgeService } from './services/waf-edge.service';
import { EdgeCacheService } from './services/edge-cache.service';

@Controller('global-edge')
@UseGuards(JwtAuthGuard, TenantGuard)
export class GlobalEdgeController {
  constructor(
    private readonly edgeRoute: EdgeRoutingService,
    private readonly geoDns: GeoDnsService,
    private readonly waf: WafEdgeService,
    private readonly cache: EdgeCacheService,
  ) {}

  @Get('heatmap')
  async getHeatmap() {
    return this.edgeRoute.getRequestHeatmap();
  }

  @Get('dns')
  async getDns() {
    return this.geoDns.getGeoDnsStatus();
  }

  @Get('waf')
  async getWaf() {
    return this.waf.getWafEvents();
  }

  @Get('cache')
  async getCache() {
    return this.cache.getCachePerformance();
  }
}