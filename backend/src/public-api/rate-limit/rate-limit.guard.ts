import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { ApiAuditService } from '../audit/api-audit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly rateLimitService: RateLimitService,
    private readonly apiAuditService: ApiAuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    let identifier = '';
    let limit = 10; // Default IP fallback: 10 requests per minute
    
    // 1. Detect Client and set quota tiers
    const client = request.client;
    if (client) {
      identifier = client.clientId;
      if (client.rateLimitPerMinute && client.rateLimitPerMinute > 0) {
        limit = client.rateLimitPerMinute;
      } else if (client.environment === 'production') {
        limit = 1000;
      } else {
        limit = 100;
      }
    } else {
      // Fallback to IP address
      const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress || 'unknown';
      identifier = `ip:${typeof ip === 'string' ? ip.split(',')[0].trim() : ip}`;
      limit = 10; // IP limit
    }

    const windowSeconds = 60;
    const rateLimit = await this.rateLimitService.checkRateLimit(identifier, limit, windowSeconds);

    // 2. Add Rate Limit response headers
    response.header('X-RateLimit-Limit', rateLimit.limit.toString());
    response.header('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.header('X-RateLimit-Reset', rateLimit.resetTime.toString());

    if (!rateLimit.allowed) {
      if (client?.clientId) {
        const ip = request.headers?.['x-forwarded-for'] || request.socket?.remoteAddress;
        await this.apiAuditService.logCall({
          clientId: client.clientId,
          endpoint: request.originalUrl || request.url,
          method: request.method,
          statusCode: 429,
          ipAddress: typeof ip === 'string' ? ip.split(',')[0].trim() : String(ip),
          userAgent: request.headers['user-agent'],
          durationMs: 0,
          errorMessage: 'Rate limit exceeded',
        });
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `API rate limit exceeded. Your tier limit is ${limit} requests per minute.`,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
