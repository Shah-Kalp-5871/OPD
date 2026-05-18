import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { SsoService } from './sso.service';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth/sso')
export class SsoController {
  constructor(
    private ssoService: SsoService,
    private authService: AuthService,
  ) {}

  /**
   * Endpoint to trigger enterprise SSO redirect sequences
   */
  @Public()
  @Get('login')
  async initiateSso(
    @Query('provider') provider: string,
    @Query('tenantId') tenantId: string,
    @Res() res: any,
  ) {
    if (!provider) {
      throw new BadRequestException('Provider parameter is required');
    }

    const redirectUrl = await this.ssoService.getSsoRedirectUrl(provider, tenantId);
    return res.redirect(redirectUrl);
  }

  /**
   * OAuth/SAML provider redirect callback endpoint
   */
  @Public()
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: any,
  ) {
    if (!code || !state) {
      throw new BadRequestException('Missing code or state tokens in callback response');
    }

    const user = await this.ssoService.processSsoCallback(code, state);
    const authResult = await this.authService.login(user);

    // Redirect user back to frontend application with access tokens
    const frontendTarget = `https://medflow-opd.com/opd/sso-success?token=${authResult.access_token}&user=${encodeURIComponent(JSON.stringify(authResult.user))}`;
    return res.redirect(frontendTarget);
  }
}
