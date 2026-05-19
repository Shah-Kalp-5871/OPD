import { Module } from '@nestjs/common';
import { ReleaseEngineeringController } from './release-engineering.controller';
import { GitOpsService } from './services/gitops.service';
import { DeploymentPipelineService } from './services/deployment-pipeline.service';
import { CanaryReleaseService } from './services/canary-release.service';
import { RollbackAutomationService } from './services/rollback-automation.service';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [TenancyModule],
  controllers: [ReleaseEngineeringController],
  providers: [
    GitOpsService,
    DeploymentPipelineService,
    CanaryReleaseService,
    RollbackAutomationService,
  ],
  exports: [
    GitOpsService,
    DeploymentPipelineService,
    CanaryReleaseService,
    RollbackAutomationService,
  ],
})
export class ReleaseEngineeringModule {}