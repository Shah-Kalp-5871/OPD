import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiUsageService } from './api-usage.service';
import { buildApiClientContext } from '../context/request-api-client.context';

@Injectable()
export class ApiQuotaGuard implements CanActivate {
  constructor(private readonly usageService: ApiUsageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.client || !request.clientId) {
      return true;
    }
    const ctx = buildApiClientContext(request);
    await this.usageService.assertQuotaAvailable(ctx);
    return true;
  }
}
