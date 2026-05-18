import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyService } from './api-key.service';
import { OAuthService } from './oauth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly apiKeyService: ApiKeyService,
    private readonly oauthService: OAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 1. Extract API Key or Bearer Token
    let tokenOrKey: string | null = null;
    let authType: 'api_key' | 'oauth' | null = null;

    // A. Check headers (x-api-key)
    const xApiKey = request.headers['x-api-key'];
    if (xApiKey && typeof xApiKey === 'string') {
      tokenOrKey = xApiKey;
      authType = 'api_key';
    }

    // B. Check Authorization header
    const authHeader = request.headers['authorization'];
    if (authHeader && typeof authHeader === 'string') {
      if (authHeader.startsWith('Bearer ')) {
        tokenOrKey = authHeader.substring(7);
        authType = 'oauth';
      } else if (authHeader.startsWith('ApiKey ')) {
        tokenOrKey = authHeader.substring(7);
        authType = 'api_key';
      }
    }

    // C. Check query parameters as fallback (useful for webhooks or rapid tests)
    const queryKey = request.query['api_key'] || request.query['token'];
    if (!tokenOrKey && queryKey && typeof queryKey === 'string') {
      tokenOrKey = queryKey;
      authType = queryKey.startsWith('mf_') ? 'api_key' : 'oauth';
    }

    if (!tokenOrKey || !authType) {
      throw new UnauthorizedException('Authentication credentials (API Key or Bearer Token) are missing');
    }

    // 2. Validate Credentials
    let client: any = null;
    let scopes: string[] = [];
    let userId: string | null = null;

    if (authType === 'api_key') {
      client = await this.apiKeyService.validateKey(tokenOrKey);
      scopes = client.scopes || [];
    } else {
      const validatedToken = await this.oauthService.validateToken(tokenOrKey);
      client = validatedToken.client;
      scopes = validatedToken.scopes || [];
      userId = validatedToken.userId || null;
    }

    if (!client) {
      throw new UnauthorizedException('Authentication failed');
    }

    // 3. Attach metadata to Request Object
    request.client = client;
    request.clientId = client.clientId;
    request.scopes = scopes;
    request.userId = userId;
    request.tenantId = client.tenantId;
    request.branchId = client.branchId;

    // 4. Validate Scopes (if route requires specific scopes)
    const requiredScopes = this.reflector.getAllAndOverride<string[]>('requiredScopes', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredScopes && requiredScopes.length > 0) {
      const hasAuthorizedScope = requiredScopes.some(s => scopes.includes(s));
      if (!hasAuthorizedScope) {
        throw new ForbiddenException(
          `Insufficient permissions. Requires one of: [${requiredScopes.join(', ')}]`
        );
      }
    }

    return true;
  }
}
