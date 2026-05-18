import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { MlopsService } from './mlops.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@Controller('mlops')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MlopsController {
  constructor(private readonly mlopsService: MlopsService) {}

  @Post('drift/evaluate/:modelName')
  async evaluateModelDrift(@Param('modelName') modelName: string) {
    return this.mlopsService.evaluateDrift(modelName);
  }

  @Get('dashboard')
  async getDashboard() {
    return this.mlopsService.getDashboardData();
  }
}
