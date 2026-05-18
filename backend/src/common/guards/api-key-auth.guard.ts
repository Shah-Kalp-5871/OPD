import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  // Registered API Consumer keys (represented as dynamic / environment records)
  private readonly consumers = [
    {
      name: 'Thyrocare Partner',
      apiKey: process.env.THYROCARE_API_KEY || 'medflow_key_thyrocare_2026',
      allowedIps: ['127.0.0.1', '::1'],
    },
    {
      name: 'Metropolis Partner',
      apiKey: process.env.METROPOLIS_API_KEY || 'medflow_key_metropolis_2026',
      allowedIps: [], // empty = any IP allowed
    },
    {
      name: 'Redcliffe Partner',
      apiKey: process.env.REDCLIFFE_API_KEY || 'medflow_key_redcliffe_2026',
      allowedIps: [],
    },
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const timestampHeader = request.headers['x-request-timestamp'];
    const clientIp = request.ip || request.connection.remoteAddress;

    if (!apiKey) {
      throw new UnauthorizedException('API Key (x-api-key header) is required');
    }

    const consumer = this.consumers.find((c) => c.apiKey === apiKey);
    if (!consumer) {
      throw new UnauthorizedException('Invalid API Key provided');
    }

    // 1. Webhook replay protection: verify timestamp is within 5 minutes
    if (timestampHeader) {
      const timestamp = parseInt(timestampHeader as string, 10);
      const diff = Math.abs(Date.now() - timestamp);
      if (isNaN(timestamp) || diff > 5 * 60 * 1000) {
        throw new ForbiddenException('Request rejected: timestamp variance too large (replay protection)');
      }
    }

    // 2. IP Allow-list validation
    if (consumer.allowedIps.length > 0) {
      const isAllowed = consumer.allowedIps.some(
        (ip) => clientIp === ip || clientIp?.endsWith(ip),
      );
      if (!isAllowed) {
        throw new ForbiddenException(`Unauthorized client IP address: ${clientIp}`);
      }
    }

    // Add consumer details to request context
    request.apiConsumer = {
      name: consumer.name,
      ip: clientIp,
    };

    return true;
  }
}
