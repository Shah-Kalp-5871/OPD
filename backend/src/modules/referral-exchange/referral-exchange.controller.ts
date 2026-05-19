import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { CareCoordinationService } from './services/care-coordination.service';
import { ProviderNetworkService } from './services/provider-network.service';

@Controller('referral-exchange')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReferralExchangeController {
  constructor(
    private readonly careService: CareCoordinationService,
    private readonly networkService: ProviderNetworkService,
  ) {}

  @Post('referrals')
  async sendReferral(@Body() data: any) {
    return this.careService.sendReferral(data);
  }

  @Get('referrals')
  async getReferrals() {
    return this.careService.getReferrals();
  }

  @Put('referrals/:id/status')
  async updateReferralStatus(@Param('id') id: string, @Body() data: any) {
    return this.careService.updateReferralStatus(id, data.status);
  }

  @Post('specialists')
  async addSpecialist(@Body() data: any) {
    return this.networkService.addSpecialist(data);
  }

  @Get('specialists')
  async getSpecialists() {
    return this.networkService.getSpecialists();
  }

  @Post('shared-care')
  async createSharedCare(@Body() data: any) {
    return this.careService.createSharedCare(data);
  }

  @Get('shared-care')
  async getSharedCares() {
    return this.careService.getSharedCares();
  }
}
