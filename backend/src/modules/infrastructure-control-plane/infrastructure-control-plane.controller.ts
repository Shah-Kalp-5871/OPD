import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { RegionOrchestratorService } from './services/region-orchestrator.service';
import { FailoverManagerService } from './services/failover-manager.service';
import { RegionHealthService } from './services/region-health.service';
import { RoutingPolicyService } from './services/routing-policy.service';

@Controller('infrastructure-control-plane')
@UseGuards(JwtAuthGuard, TenantGuard)
export class InfrastructureControlPlaneController {
  constructor(
    private readonly regionOrch: RegionOrchestratorService,
    private readonly failover: FailoverManagerService,
    private readonly health: RegionHealthService,
    private readonly policy: RoutingPolicyService,
  ) {}

  @Get('regions')
  async getRegions() {
    return this.regionOrch.getRegions();
  }

  @Put('regions/:id/status')
  async updateRegionStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.regionOrch.updateRegionStatus(id, body.status);
  }

  @Get('failovers')
  async getFailovers() {
    return this.failover.getFailoverEvents();
  }

  @Post('failovers/trigger')
  async triggerFailover(@Body() body: { sourceRegion: string; targetRegion: string; triggerReason: string }) {
    return this.failover.triggerFailover(body.sourceRegion, body.targetRegion, body.triggerReason);
  }

  @Get('health/metrics')
  async getHealthMetrics() {
    return this.health.getHealthMetrics();
  }

  @Get('health/incidents')
  async getIncidents() {
    return this.health.getInfrastructureIncidents();
  }

  @Post('health/incidents')
  async createIncident(@Body() body: { incidentTitle: string; severity: string; affectedRegion: string }) {
    return this.health.createIncident(body.incidentTitle, body.severity, body.affectedRegion);
  }

  @Get('policies')
  async getPolicies() {
    return this.policy.getRoutingPolicies();
  }

  @Put('policies/:id')
  async updatePolicy(
    @Param('id') id: string,
    @Body() body: { routingMethod: string; primaryRegion: string; failoverRegion: string },
  ) {
    return this.policy.updateRoutingPolicy(id, body);
  }
}