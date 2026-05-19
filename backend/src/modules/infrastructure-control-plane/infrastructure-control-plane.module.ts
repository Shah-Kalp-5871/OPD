import { Module } from '@nestjs/common';
import { InfrastructureControlPlaneController } from './infrastructure-control-plane.controller';
import { RegionOrchestratorService } from './services/region-orchestrator.service';
import { FailoverManagerService } from './services/failover-manager.service';
import { RegionHealthService } from './services/region-health.service';
import { RoutingPolicyService } from './services/routing-policy.service';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [TenancyModule],
  controllers: [InfrastructureControlPlaneController],
  providers: [
    RegionOrchestratorService,
    FailoverManagerService,
    RegionHealthService,
    RoutingPolicyService,
  ],
  exports: [
    RegionOrchestratorService,
    FailoverManagerService,
    RegionHealthService,
    RoutingPolicyService,
  ],
})
export class InfrastructureControlPlaneModule {}