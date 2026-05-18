import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ApiClient } from '@prisma/client';

export interface RequestApiClientContext {
  client: ApiClient;
  clientId: string;
  tenantId: string | null;
  branchId: string | null;
  scopes: string[];
  userId: string | null;
  correlationId: string;
}

export function buildApiClientContext(request: {
  client?: ApiClient;
  clientId?: string;
  tenantId?: string | null;
  branchId?: string | null;
  scopes?: string[];
  userId?: string | null;
  headers?: Record<string, string | string[] | undefined>;
}): RequestApiClientContext {
  if (!request.client || !request.clientId) {
    throw new ForbiddenException('API client context is not available');
  }

  const correlationHeader = request.headers?.['x-correlation-id'];
  const correlationId =
    (typeof correlationHeader === 'string' ? correlationHeader : correlationHeader?.[0]) ||
    `corr_${Date.now()}`;

  return {
    client: request.client,
    clientId: request.clientId,
    tenantId: request.tenantId ?? request.client.tenantId ?? null,
    branchId: request.branchId ?? request.client.branchId ?? null,
    scopes: request.scopes ?? request.client.scopes ?? [],
    userId: request.userId ?? null,
    correlationId,
  };
}

export const ApiClientCtx = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestApiClientContext => {
    const request = ctx.switchToHttp().getRequest();
    return buildApiClientContext(request);
  },
);
