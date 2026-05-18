import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { ApiKeyService } from './api-key.service';
import { Response } from 'express';

@Controller('api/v2/oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  /**
   * Registers a new developer client app.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerClient(
    @Body() body: { name: string; scopes: string[]; environment?: 'production' | 'sandbox'; tenantId?: string }
  ) {
    return this.apiKeyService.registerClient(body);
  }

  /**
   * Authorization Code Flow: Exposes authorization page details or handles authorization code generation.
   * In a real-world app, this endpoint would serve a user login screen or accept session auth.
   */
  @Get('authorize')
  async authorize(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('code_challenge') codeChallenge: string,
    @Query('code_challenge_method') codeChallengeMethod: 'S256' | 'plain',
    @Query('scope') scope: string,
    @Query('state') state: string,
    @Query('userId') userId: string, // Simulated user login session parameter
    @Res() res: any
  ) {
    const scopes = scope ? scope.split(' ') : [];
    
    const authCode = await this.oauthService.generateAuthorizationCode({
      clientId,
      userId: userId || 'anonymous_user',
      scopes,
      codeChallenge,
      codeChallengeMethod: codeChallengeMethod || 'S256',
      redirectUri,
    });

    const redirectUrl = `${redirectUri}?code=${authCode}&state=${state}`;
    return res.redirect(redirectUrl);
  }

  /**
   * Token exchange endpoint.
   * Handles client_credentials, authorization_code, and refresh_token flows.
   */
  @Post('token')
  @HttpCode(HttpStatus.OK)
  async token(
    @Body() body: {
      grant_type: 'authorization_code' | 'client_credentials' | 'refresh_token';
      client_id: string;
      client_secret?: string;
      code?: string;
      code_verifier?: string;
      refresh_token?: string;
      scope?: string;
    }
  ) {
    const scopes = body.scope ? body.scope.split(' ') : undefined;

    return this.oauthService.issueTokens({
      grantType: body.grant_type,
      clientId: body.client_id,
      clientSecret: body.client_secret,
      code: body.code,
      codeVerifier: body.code_verifier,
      refreshToken: body.refresh_token,
      scopes,
    });
  }
}
