import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { GitOpsService } from './services/gitops.service';
import { DeploymentPipelineService } from './services/deployment-pipeline.service';
import { CanaryReleaseService } from './services/canary-release.service';
import { RollbackAutomationService } from './services/rollback-automation.service';

@Controller('release-engineering')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReleaseEngineeringController {
  constructor(
    private readonly gitops: GitOpsService,
    private readonly deployment: DeploymentPipelineService,
    private readonly canary: CanaryReleaseService,
    private readonly rollback: RollbackAutomationService,
  ) {}

  @Get('gitops')
  async getGitops() {
    return this.gitops.getArgoCdState();
  }

  @Get('deployments')
  async getDeployments() {
    return this.deployment.getDeployments();
  }

  @Get('canary')
  async getCanary() {
    return this.canary.getCanaryStatus();
  }

  @Post('canary/weight')
  async setCanaryWeight(@Body() body: { weight: number }) {
    return this.canary.setCanaryWeight(body.weight);
  }

  @Post('emergency-rollback')
  async rollbackDeployments() {
    return this.rollback.triggerEmergencyRollback();
  }
}