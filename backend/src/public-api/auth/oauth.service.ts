import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import * as crypto from 'crypto';

@Injectable()
export class OAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisCacheService,
  ) {}

  /**
   * Helper to verify PKCE Challenge.
   */
  private verifyPkce(verifier: string, challenge: string, method: string): boolean {
    if (method === 'plain') {
      return verifier === challenge;
    }

    if (method === 'S256') {
      const hash = crypto.createHash('sha256').update(verifier).digest('base64url');
      return hash === challenge;
    }

    return false;
  }

  /**
   * 1. Authorization Code + PKCE Flow: Authorize Request.
   * Generates a temporary authorization code and stores PKCE details in Redis (5 min TTL).
   */
  async generateAuthorizationCode(params: {
    clientId: string;
    userId: string;
    scopes: string[];
    codeChallenge: string;
    codeChallengeMethod: 'S256' | 'plain';
    redirectUri: string;
  }): Promise<string> {
    // Verify client is active
    const client = await this.prisma.apiClient.findUnique({
      where: { clientId: params.clientId },
    });

    if (!client || !client.isActive) {
      throw new UnauthorizedException('Invalid or inactive client');
    }

    // Verify scope validity
    const invalidScopes = params.scopes.filter(s => !client.scopes.includes(s));
    if (invalidScopes.length > 0) {
      throw new BadRequestException(`Invalid scopes requested: ${invalidScopes.join(', ')}`);
    }

    const authCode = `code_${crypto.randomBytes(24).toString('hex')}`;
    const redisKey = `oauth:code:${authCode}`;

    // Store auth code state in Redis with 5 minutes expiry
    await this.redis.set(
      redisKey,
      JSON.stringify({
        clientId: params.clientId,
        userId: params.userId,
        scopes: params.scopes,
        codeChallenge: params.codeChallenge,
        codeChallengeMethod: params.codeChallengeMethod,
        redirectUri: params.redirectUri,
      }),
      300000 // 5 minutes in milliseconds
    );

    return authCode;
  }

  /**
   * 2. Exchanging Authorization Code + PKCE or Client Credentials for Access & Refresh Tokens.
   */
  async issueTokens(params: {
    grantType: 'authorization_code' | 'client_credentials' | 'refresh_token';
    clientId: string;
    clientSecret?: string;
    code?: string;
    codeVerifier?: string;
    refreshToken?: string;
    scopes?: string[];
  }) {
    const client = await this.prisma.apiClient.findUnique({
      where: { clientId: params.clientId },
    });

    if (!client || !client.isActive) {
      throw new UnauthorizedException('Invalid or inactive client');
    }

    // --- Authorization Code with PKCE ---
    if (params.grantType === 'authorization_code') {
      if (!params.code || !params.codeVerifier) {
        throw new BadRequestException('Authorization code and verifier are required for authorization_code grant');
      }

      const redisKey = `oauth:code:${params.code}`;
      const savedCodeStr = await this.redis.get<string>(redisKey);
      if (!savedCodeStr) {
        throw new BadRequestException('Invalid or expired authorization code');
      }

      const savedCode = JSON.parse(savedCodeStr);
      await this.redis.del(redisKey); // One-time use authorization code

      if (savedCode.clientId !== params.clientId) {
        throw new UnauthorizedException('Authorization code mismatch');
      }

      // Verify PKCE
      const isPkceValid = this.verifyPkce(
        params.codeVerifier,
        savedCode.codeChallenge,
        savedCode.codeChallengeMethod
      );

      if (!isPkceValid) {
        throw new UnauthorizedException('PKCE verification failed');
      }

      return this.createTokens({
        clientId: client.clientId,
        userId: savedCode.userId,
        scopes: savedCode.scopes,
      });
    }

    // --- Client Credentials Flow (Server-to-Server) ---
    if (params.grantType === 'client_credentials') {
      if (!params.clientSecret) {
        throw new BadRequestException('client_secret is required for client_credentials grant');
      }

      const hashedSecret = crypto.createHash('sha256').update(params.clientSecret).digest('hex');
      if (client.clientSecret !== hashedSecret) {
        throw new UnauthorizedException('Invalid client credentials');
      }

      const requestedScopes = params.scopes || client.scopes;
      const invalidScopes = requestedScopes.filter(s => !client.scopes.includes(s));
      if (invalidScopes.length > 0) {
        throw new BadRequestException(`Requested scopes exceed client authorization: ${invalidScopes.join(', ')}`);
      }

      return this.createTokens({
        clientId: client.clientId,
        scopes: requestedScopes,
      });
    }

    // --- Refresh Token Flow ---
    if (params.grantType === 'refresh_token') {
      if (!params.refreshToken) {
        throw new BadRequestException('refresh_token is required');
      }

      const existingToken = await this.prisma.oAuthToken.findUnique({
        where: { refreshToken: params.refreshToken },
      });

      if (!existingToken || existingToken.clientId !== params.clientId || existingToken.revokedAt) {
        throw new UnauthorizedException('Invalid or revoked refresh token');
      }

      // Revoke the old refresh token
      await this.prisma.oAuthToken.update({
        where: { id: existingToken.id },
        data: { revokedAt: new Date() },
      });

      return this.createTokens({
        clientId: client.clientId,
        userId: existingToken.userId || undefined,
        scopes: existingToken.scopes,
      });
    }

    throw new BadRequestException('Unsupported grant_type');
  }

  /**
   * Helper to create Access and Refresh Tokens in DB.
   */
  private async createTokens(params: { clientId: string; userId?: string; scopes: string[] }) {
    const accessToken = `at_${crypto.randomBytes(32).toString('hex')}`;
    const refreshToken = `rt_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour access token lifetime

    const oauthToken = await this.prisma.oAuthToken.create({
      data: {
        clientId: params.clientId,
        userId: params.userId,
        accessToken,
        refreshToken,
        scopes: params.scopes,
        expiresAt,
      },
    });

    return {
      access_token: oauthToken.accessToken,
      refresh_token: oauthToken.refreshToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: oauthToken.scopes.join(' '),
    };
  }

  /**
   * Validates an access token and returns associated client and scope metadata.
   */
  async validateToken(accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    const token = await this.prisma.oAuthToken.findUnique({
      where: { accessToken },
      include: {
        client: true,
      },
    });

    if (!token || token.revokedAt || new Date() > token.expiresAt) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    if (!token.client || !token.client.isActive) {
      throw new UnauthorizedException('Client app associated with token is inactive');
    }

    return {
      clientId: token.clientId,
      userId: token.userId,
      scopes: token.scopes,
      tenantId: token.client.tenantId,
      client: token.client,
    };
  }
}
