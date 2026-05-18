import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SsoService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Generates authorization redirect URLs for enterprise provider SSO streams
   */
  async getSsoRedirectUrl(provider: string, tenantId?: string): Promise<string> {
    const validProviders = ['google', 'okta', 'saml'];
    if (!validProviders.includes(provider.toLowerCase())) {
      throw new BadRequestException('Unsupported SSO provider');
    }

    const stateToken = this.jwtService.sign(
      { provider, tenantId, timestamp: Date.now() },
      { expiresIn: '15m' },
    );

    // Dynamic mock redirect targets that will post-back to SSO endpoints
    if (provider.toLowerCase() === 'google') {
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=MOCK_GOOGLE_CLIENT_ID&redirect_uri=https://medflow-opd.com/api/auth/sso/callback&response_type=code&scope=email%20profile&state=${stateToken}`;
    }

    if (provider.toLowerCase() === 'okta') {
      return `https://medflow-okta.okta.com/oauth2/default/v1/authorize?client_id=MOCK_OKTA_CLIENT_ID&redirect_uri=https://medflow-opd.com/api/auth/sso/callback&response_type=code&scope=openid%20email%20profile&state=${stateToken}`;
    }

    // Default SAML enterprise target
    return `https://medflow-saml.com/sso/login?state=${stateToken}`;
  }

  /**
   * Processes OAuth/SAML callbacks and resolves matching tenant profiles
   */
  async processSsoCallback(code: string, state: string) {
    try {
      // 1. Verify redirect states
      const decodedState = this.jwtService.verify(state);
      const provider = decodedState.provider;
      const targetTenantId = decodedState.tenantId;

      // 2. Decode user identity parameters
      // In production, exchange the OAuth code for user profile tokens
      // Here, we simulate resolving an authenticated enterprise user payload
      const mockEmail = `enterprise_doctor@${targetTenantId ? 'clinic-' + targetTenantId.substring(0, 4) : 'hospital-net'}.com`;
      const mockName = 'Enterprise Clinical Specialist';
      const mockProviderId = `sso_${provider}_${Math.random().toString(36).substring(7)}`;

      // 3. Match tenant domains dynamically
      const emailDomain = mockEmail.split('@')[1];
      const matchedDomain = await this.prisma.tenantDomain.findFirst({
        where: {
          domain: emailDomain,
          isVerified: true,
        },
        include: {
          tenant: true,
        },
      });

      // 4. Locate or provision the User profile
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: mockEmail },
            { ssoId: mockProviderId },
          ],
        },
        include: {
          branchAccess: true,
        },
      });

      if (!user) {
        // Dynamic provisioning for whitelisted enterprise workspace domains
        const assignedTenantId = targetTenantId || matchedDomain?.tenantId;
        if (!assignedTenantId) {
          throw new UnauthorizedException('SSO domain is not registered or verified under any active tenant.');
        }

        user = await this.prisma.user.create({
          data: {
            email: mockEmail,
            name: mockName,
            password: await this.hashPassword(Math.random().toString(36)), // Secure fallback password
            role: 'DOCTOR',
            isActive: true,
            ssoProvider: provider,
            ssoId: mockProviderId,
          },
          include: {
            branchAccess: true,
          },
        });

        // Map user to the tenant
        await this.prisma.tenantUser.create({
          data: {
            tenantId: assignedTenantId,
            userId: user.id,
            role: 'MEMBER',
          },
        });
      }

      return user;
    } catch (e) {
      throw new UnauthorizedException('SSO assertion validation failed');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    return bcrypt.hash(password, 10);
  }
}
