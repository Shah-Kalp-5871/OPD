import { Module } from '@nestjs/common';
import { CloudOrchestrationController } from './cloud-orchestration.controller';
import { KubernetesOpsService } from './services/kubernetes-ops.service';
import { ServiceMeshService } from './services/service-mesh.service';
import { PodHealthService } from './services/pod-health.service';
import { AutoScalingService } from './services/auto-scaling.service';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [TenancyModule],
  controllers: [CloudOrchestrationController],
  providers: [
    KubernetesOpsService,
    ServiceMeshService,
    PodHealthService,
    AutoScalingService,
  ],
  exports: [
    KubernetesOpsService,
    ServiceMeshService,
    PodHealthService,
    AutoScalingService,
  ],
})
export class CloudOrchestrationModule {}