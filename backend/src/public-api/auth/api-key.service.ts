import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a new API Key for a client.
   * Prefix: mf_live_ for production, mf_test_ for sandbox environment.
   */
  generateKey(environment: 'production' | 'sandbox' = 'production'): { rawKey: string; hashedKey: string } {
    const prefix = environment === 'production' ? 'mf_live_' : 'mf_test_';
    const randomHex = crypto.randomBytes(32).toString('hex');
    const rawKey = `${prefix}${randomHex}`;
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');
    return { rawKey, hashedKey };
  }

  /**
   * Registers a new API developer/corporate client.
   */
  async registerClient(params: {
    name: string;
    scopes: string[];
    environment?: 'production' | 'sandbox';
    tenantId?: string;
  }) {
    const environment = params.environment || 'production';
    const clientId = `client_${crypto.randomBytes(12).toString('hex')}`;
    const clientSecretRaw = crypto.randomBytes(32).toString('hex');
    const clientSecretHash = crypto.createHash('sha256').update(clientSecretRaw).digest('hex');
    const { rawKey, hashedKey } = this.generateKey(environment);

    const client = await this.prisma.apiClient.create({
      data: {
        name: params.name,
        clientId,
        clientSecret: clientSecretHash,
        apiKey: hashedKey,
        apiKeyPrefix: environment === 'production' ? 'mf_live_' : 'mf_test_',
        scopes: params.scopes,
        environment,
        tenantId: params.tenantId,
        isActive: true,
      },
    });

    return {
      clientId: client.clientId,
      clientSecret: clientSecretRaw,
      apiKey: rawKey,
      name: client.name,
      scopes: client.scopes,
      environment: client.environment,
    };
  }

  /**
   * Validates an API Key.
   * Compares the SHA-256 hash of the key and checks if the client is active.
   */
  async validateKey(apiKey: string) {
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

    const client = await this.prisma.apiClient.findUnique({
      where: { apiKey: hashedKey },
    });

    if (!client || !client.isActive || !client.apiKeyActive) {
      throw new UnauthorizedException('Invalid or inactive API key');
    }

    return client;
  }

  /**
   * Revokes an API Key.
   */
  async revokeKey(clientId: string) {
    return this.prisma.apiClient.update({
      where: { clientId },
      data: {
        apiKeyActive: false,
      },
    });
  }

  /**
   * Regenerates a new API Key for an existing client.
   */
  async regenerateKey(clientId: string) {
    const client = await this.prisma.apiClient.findUnique({
      where: { clientId },
    });

    if (!client) {
      throw new UnauthorizedException('Client not found');
    }

    const { rawKey, hashedKey } = this.generateKey(client.environment as 'production' | 'sandbox');

    await this.prisma.apiClient.update({
      where: { clientId },
      data: {
        apiKey: hashedKey,
        apiKeyPrefix: client.environment === 'production' ? 'mf_live_' : 'mf_test_',
        apiKeyActive: true,
      },
    });

    return {
      apiKey: rawKey,
    };
  }
}
