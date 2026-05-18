import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyService } from './api-key.service';
import { OAuthService } from './oauth.service';
import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let apiKeyService: ApiKeyService;
  let oauthService: OAuthService;
  let reflector: Reflector;

  const mockApiKeyService = {
    validateKey: jest.fn(),
  };

  const mockOauthService = {
    validateToken: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        { provide: ApiKeyService, useValue: mockApiKeyService },
        { provide: OAuthService, useValue: mockOauthService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    apiKeyService = module.get<ApiKeyService>(ApiKeyService);
    oauthService = module.get<OAuthService>(OAuthService);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow public routes directly', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(true); // isPublic = true

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if no API key or auth token is present', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false); // not public

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          query: {},
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should validate API key via x-api-key header and attach client details', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);
    
    const mockClient = {
      clientId: 'cli_123',
      isActive: true,
      scopes: ['appointments:read'],
      tenantId: 'branch_abc',
      environment: 'sandbox',
    };

    mockApiKeyService.validateKey.mockResolvedValue(mockClient);

    const request: any = {
      headers: { 'x-api-key': 'mf_test_key123' },
      query: {},
    };

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(request.client).toEqual(mockClient);
    expect(request.clientId).toBe(mockClient.clientId);
    expect(request.tenantId).toBe(mockClient.tenantId);
    expect(apiKeyService.validateKey).toHaveBeenCalledWith('mf_test_key123');
  });

  it('should validate API key via Authorization: ApiKey header', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);

    const mockClient = {
      clientId: 'cli_123',
      scopes: ['appointments:read'],
      tenantId: 'branch_abc',
    };

    mockApiKeyService.validateKey.mockResolvedValue(mockClient);

    const request: any = {
      headers: { authorization: 'ApiKey mf_test_key123' },
      query: {},
    };

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(apiKeyService.validateKey).toHaveBeenCalledWith('mf_test_key123');
  });

  it('should validate Bearer Token via Authorization: Bearer header', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);

    const mockClient = {
      clientId: 'cli_oauth',
    };

    mockOauthService.validateToken.mockResolvedValue({
      clientId: 'cli_oauth',
      userId: 'user_123',
      scopes: ['appointments:read'],
      tenantId: 'branch_oauth',
      client: mockClient,
    });

    const request: any = {
      headers: { authorization: 'Bearer access_token_123' },
      query: {},
    };

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(request.clientId).toBe('cli_oauth');
    expect(request.userId).toBe('user_123');
    expect(oauthService.validateToken).toHaveBeenCalledWith('access_token_123');
  });

  it('should throw ForbiddenException if required scopes are missing', async () => {
    mockReflector.getAllAndOverride.mockImplementation((metadataKey) => {
      if (metadataKey === 'isPublic') return false;
      if (metadataKey === 'requiredScopes') return ['appointments:write']; // requires appointments:write
      return null;
    });

    const mockClient = {
      clientId: 'cli_123',
      scopes: ['appointments:read'], // only has read
    };

    mockApiKeyService.validateKey.mockResolvedValue(mockClient);

    const request: any = {
      headers: { 'x-api-key': 'mf_test_key123' },
      query: {},
    };

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
