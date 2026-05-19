import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
  SetMetadata,
} from '@nestjs/common';
import { TenantOnboardingService } from '../services/tenant-onboarding.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { TenantGuard } from '../guards/tenant.guard';

// Custom metadata helper to mark routes as public
const Public = () => SetMetadata('isPublic', true);

@Controller('v2/tenants')
export class TenantController {
  constructor(private readonly onboardingService: TenantOnboardingService) {}

  @Post('onboarding')
  @Public()
  async registerTenant(
    @Body()
    dto: {
      name: string;
      slug: string;
      adminName: string;
      adminEmail: string;
      password?: string;
    },
  ) {
    return this.onboardingService.registerTenant(dto);
  }

  @Get('branding/resolve')
  @Public()
  async resolveBranding(@Request() req: any) {
    if (!req.tenantId) {
      return {
        id: null,
        tenantId: null,
        companyName: 'MedFlow',
        logoUrl: null,
        faviconUrl: null,
        primaryColor: '#0f766e',
        secondaryColor: '#0d9488',
        customCss: '',
      };
    }
    const details = await this.onboardingService.getTenantDetails(req.tenantId);
    return details.branding || {
      tenantId: req.tenantId,
      companyName: details.name,
      primaryColor: '#0f766e',
      secondaryColor: '#0d9488',
      customCss: '',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getTenantDetails(@Request() req: any) {
    return this.onboardingService.getTenantDetails(req.tenantId);
  }

  @Put('branding')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async updateBranding(
    @Request() req: any,
    @Body()
    dto: {
      companyName?: string;
      logoUrl?: string;
      faviconUrl?: string;
      primaryColor?: string;
      secondaryColor?: string;
      customCss?: string;
    },
  ) {
    return this.onboardingService.updateTenantBranding(req.tenantId, req.user.id, dto);
  }

  @Post('domains')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async addCustomDomain(
    @Request() req: any,
    @Body('domain') domain: string,
  ) {
    return this.onboardingService.addCustomDomain(req.tenantId, req.user.id, domain);
  }

  @Post('domains/:domainId/verify')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async verifyCustomDomain(
    @Request() req: any,
    @Param('domainId') domainId: string,
  ) {
    return this.onboardingService.verifyCustomDomain(req.tenantId, req.user.id, domainId);
  }
}
