import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitGuard } from './rate-limit.guard';
import { RateLimitService } from './rate-limit.service';
import { ApiAuditService } from '../audit/api-audit.service';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let service: RateLimitService;

  const mockRateLimitService = {
    checkRateLimit: jest.fn(),
  };

  const mockApiAuditService = {
    logCall: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitGuard,
        { provide: RateLimitService, useValue: mockRateLimitService },
        { provide: ApiAuditService, useValue: mockApiAuditService },
      ],
    }).compile();

    guard = module.get<RateLimitGuard>(RateLimitGuard);
    service = module.get<RateLimitService>(RateLimitService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow request and append headers if rate limit is within sandbox standard quota', async () => {
    mockRateLimitService.checkRateLimit.mockResolvedValue({
      allowed: true,
      limit: 100,
      remaining: 99,
      resetTime: 60,
    });

    const request = {
      client: {
        clientId: 'cli_sandbox',
        environment: 'sandbox',
      },
    };

    const headers: any = {};
    const response = {
      header: (name: string, value: string) => {
        headers[name] = value;
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(headers['X-RateLimit-Limit']).toBe('100');
    expect(headers['X-RateLimit-Remaining']).toBe('99');
    expect(headers['X-RateLimit-Reset']).toBe('60');
    expect(service.checkRateLimit).toHaveBeenCalledWith('cli_sandbox', 100, 60);
  });

  it('should allocate premium corporate quota of 1000 for production developer environment client', async () => {
    mockRateLimitService.checkRateLimit.mockResolvedValue({
      allowed: true,
      limit: 1000,
      remaining: 999,
      resetTime: 60,
    });

    const request = {
      client: {
        clientId: 'cli_production',
        environment: 'production',
      },
    };

    const response = { header: jest.fn() };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;

    await guard.canActivate(context);
    expect(service.checkRateLimit).toHaveBeenCalledWith('cli_production', 1000, 60);
  });

  it('should fallback to IP address quota of 10 req/min for unauthenticated endpoints', async () => {
    mockRateLimitService.checkRateLimit.mockResolvedValue({
      allowed: true,
      limit: 10,
      remaining: 9,
      resetTime: 60,
    });

    const request = {
      client: null,
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      },
      socket: {
        remoteAddress: '127.0.0.1',
      },
    };

    const response = { header: jest.fn() };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;

    await guard.canActivate(context);
    expect(service.checkRateLimit).toHaveBeenCalledWith('ip:192.168.1.1', 10, 60);
  });

  it('should throw HTTP 429 HttpException when quota limit is exceeded', async () => {
    mockRateLimitService.checkRateLimit.mockResolvedValue({
      allowed: false,
      limit: 100,
      remaining: 0,
      resetTime: 45,
    });

    const request = {
      client: {
        clientId: 'cli_sandbox',
        environment: 'sandbox',
      },
      headers: {},
      originalUrl: '/api/v2/patients',
      method: 'GET',
    };

    const response = { header: jest.fn() };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'API rate limit exceeded. Your tier limit is 100 requests per minute.',
        },
        HttpStatus.TOO_MANY_REQUESTS
      )
    );
  });
});
