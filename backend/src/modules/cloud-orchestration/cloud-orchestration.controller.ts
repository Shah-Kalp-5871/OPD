import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { KubernetesOpsService } from './services/kubernetes-ops.service';
import { ServiceMeshService } from './services/service-mesh.service';
import { PodHealthService } from './services/pod-health.service';
import { AutoScalingService } from './services/auto-scaling.service';

@Controller('cloud-orchestration')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CloudOrchestrationController {
  constructor(
    private readonly k8s: KubernetesOpsService,
    private readonly mesh: ServiceMeshService,
    private readonly pod: PodHealthService,
    private readonly hpa: AutoScalingService,
  ) {}

  @Get('nodes')
  async getNodes() {
    return this.k8s.getClusterNodes();
  }

  @Get('mesh/security')
  async getMeshSecurity() {
    return this.mesh.getMeshSecurityStatus();
  }

  @Get('pods')
  async getPods() {
    return this.pod.getPodGridStatus();
  }

  @Get('autoscaling')
  async getAutoscaling() {
    return this.hpa.getHpaStatus();
  }
}