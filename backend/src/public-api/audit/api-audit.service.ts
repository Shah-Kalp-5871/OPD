import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiAuditService {
  private readonly logger = new Logger('ApiAuditService');

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a public API call in the ApiAuditLog table.
   */
  async logCall(params: {
    clientId: string;
    endpoint: string;
    method: string;
    statusCode: number;
    ipAddress?: string;
    userAgent?: string;
    durationMs: number;
    errorMessage?: string;
  }) {
    try {
      await this.prisma.apiAuditLog.create({
        data: {
          clientId: params.clientId,
          endpoint: params.endpoint,
          method: params.method,
          statusCode: params.statusCode,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          durationMs: params.durationMs,
          errorMessage: params.errorMessage,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create API Audit Log: ${error.message}`);
    }
  }
}
