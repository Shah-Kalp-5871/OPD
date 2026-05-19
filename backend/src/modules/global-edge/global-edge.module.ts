import { Module } from '@nestjs/common';
import { GlobalEdgeController } from './global-edge.controller';
import { EdgeRoutingService } from './services/edge-routing.service';
import { GeoDnsService } from './services/geo-dns.service';
import { WafEdgeService } from './services/waf-edge.service';
import { EdgeCacheService } from './services/edge-cache.service';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [TenancyModule],
  controllers: [GlobalEdgeController],
  providers: [
    EdgeRoutingService,
    GeoDnsService,
    WafEdgeService,
    EdgeCacheService,
  ],
  exports: [
    EdgeRoutingService,
    GeoDnsService,
    WafEdgeService,
    EdgeCacheService,
  ],
})
export class GlobalEdgeModule {}