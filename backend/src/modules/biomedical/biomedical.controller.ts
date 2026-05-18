import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BiomedicalService } from './biomedical.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('biomedical')
export class BiomedicalController {
  constructor(private readonly svc: BiomedicalService) {}

  @Get('dashboard')
  getDashboard() { return this.svc.getDashboardData(); }

  @Post('assets')
  registerAsset(@Body() body: Parameters<BiomedicalService['registerAsset']>[0]) {
    return this.svc.registerAsset(body);
  }

  @Post('maintenance')
  scheduleMaintenance(@Body() body: Parameters<BiomedicalService['scheduleMaintenance']>[0]) {
    return this.svc.scheduleMaintenance(body);
  }

  @Post('downtime')
  recordDowntime(@Body() body: { assetId: string; reason: string; startedAt: string; impact?: string }) {
    return this.svc.recordDowntime({ ...body, startedAt: new Date(body.startedAt) });
  }
}
