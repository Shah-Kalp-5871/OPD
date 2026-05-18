import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiKeyService } from '../auth/api-key.service';

const VALID_SCOPES = [
  'patients:read',
  'patients:write',
  'appointments:read',
  'appointments:write',
  'webhooks:read',
  'webhooks:write',
  'billing:read',
];

@Injectable()
export class ApiClientAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  async listClients(tenantId: string) {
    return this.prisma.apiClient.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        clientId: true,
        scopes: true,
        environment: true,
        isActive: true,
        apiKeyActive: true,
        apiKeyPrefix: true,
        branchId: true,
        rateLimitPerMinute: true,
        monthlyQuota: true,
        monthlyUsageCount: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            webhooks: true,
            auditLogs: true,
            oauthTokens: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createClient(params: {
    name: string;
    scopes: string[];
    environment?: 'production' | 'sandbox';
    tenantId: string;
    branchId?: string;
    rateLimitPerMinute?: number;
    monthlyQuota?: number;
  }) {
    this.validateScopes(params.scopes);

    if (params.branchId) {
      const branch = await this.prisma.branch.findFirst({
        where: {
          id: params.branchId,
          clinic: { tenantId: params.tenantId },
        },
      });
      if (!branch) {
        throw new BadRequestException('Branch does not belong to tenant');
      }
    }

    const registered = await this.apiKeyService.registerClient({
      name: params.name,
      scopes: params.scopes,
      environment: params.environment,
      tenantId: params.tenantId,
    });

    await this.prisma.apiClient.update({
      where: { clientId: registered.clientId },
      data: {
        branchId: params.branchId,
        rateLimitPerMinute: params.rateLimitPerMinute ?? 100,
        monthlyQuota: params.monthlyQuota ?? 100000,
      },
    });

    return registered;
  }

  async updateClient(
    tenantId: string,
    clientId: string,
    data: {
      name?: string;
      scopes?: string[];
      environment?: string;
      isActive?: boolean;
      branchId?: string | null;
      rateLimitPerMinute?: number;
      monthlyQuota?: number;
    },
  ) {
    await this.assertTenantClient(tenantId, clientId);
    if (data.scopes) this.validateScopes(data.scopes);

    return this.prisma.apiClient.update({
      where: { clientId },
      data: {
        name: data.name,
        scopes: data.scopes,
        environment: data.environment,
        isActive: data.isActive,
        branchId: data.branchId,
        rateLimitPerMinute: data.rateLimitPerMinute,
        monthlyQuota: data.monthlyQuota,
      },
    });
  }

  async rotateKey(tenantId: string, clientId: string) {
    await this.assertTenantClient(tenantId, clientId);
    return this.apiKeyService.regenerateKey(clientId);
  }

  async revokeKey(tenantId: string, clientId: string) {
    await this.assertTenantClient(tenantId, clientId);
    return this.apiKeyService.revokeKey(clientId);
  }

  async getClientDetail(tenantId: string, clientId: string) {
    await this.assertTenantClient(tenantId, clientId);

    const client = await this.prisma.apiClient.findUnique({
      where: { clientId },
      include: {
        webhooks: {
          include: {
            _count: { select: { deliveries: true } },
          },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        oauthTokens: {
          where: { revokedAt: null },
          select: { id: true, scopes: true, expiresAt: true, createdAt: true },
        },
      },
    });

    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  private validateScopes(scopes: string[]) {
    const invalid = scopes.filter((s) => !VALID_SCOPES.includes(s));
    if (invalid.length > 0) {
      throw new BadRequestException(`Invalid scopes: ${invalid.join(', ')}`);
    }
  }

  private async assertTenantClient(tenantId: string, clientId: string) {
    const client = await this.prisma.apiClient.findFirst({
      where: { clientId, tenantId },
    });
    if (!client) {
      throw new NotFoundException('API client not found for tenant');
    }
  }
}
