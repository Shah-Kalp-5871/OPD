import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FacilityOpsService } from './facility-ops.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('facility-ops')
export class FacilityOpsController {
  constructor(private readonly svc: FacilityOpsService) {}

  @Get('dashboard')
  getDashboard() { return this.svc.getDashboardData(); }

  @Post('facilities')
  createFacility(@Body() body: Parameters<FacilityOpsService['createFacility']>[0]) {
    return this.svc.createFacility(body);
  }

  @Post('tickets')
  createTicket(@Body() body: Parameters<FacilityOpsService['createTicket']>[0]) {
    return this.svc.createTicket(body);
  }

  @Post('tickets/:id/resolve')
  resolveTicket(@Param('id') id: string, @Body() body: { cost?: number }) {
    return this.svc.resolveTicket(id, body.cost);
  }

  @Post('energy')
  recordEnergy(@Body() body: Parameters<FacilityOpsService['recordEnergy']>[0]) {
    return this.svc.recordEnergy(body);
  }

  @Post('incidents')
  fileIncident(@Body() body: Parameters<FacilityOpsService['fileIncident']>[0]) {
    return this.svc.fileIncident(body);
  }
}
