import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { HealthIdVerificationService } from './services/health-id-verification.service';
import { RegistrySyncService } from './services/registry-sync.service';

@Controller('national-registry')
@UseGuards(JwtAuthGuard, TenantGuard)
export class NationalRegistryController {
  constructor(
    private readonly verifyService: HealthIdVerificationService,
    private readonly syncService: RegistrySyncService,
  ) {}

  @Post('verify')
  async verifyId(@Body() data: any) {
    return this.verifyService.verifyCitizenId(data);
  }

  @Get('verifications')
  async getVerifications() {
    return this.verifyService.getVerifications();
  }

  @Post('sync')
  async syncRecord(@Body() data: any) {
    return this.syncService.syncRecord(data);
  }

  @Get('syncs')
  async getSyncs() {
    return this.syncService.getSyncLogs();
  }
}
