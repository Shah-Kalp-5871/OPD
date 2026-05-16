import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger('AuditService');

  constructor(private prisma: PrismaService) {}

  async logEvent(params: {
    userId?: string;
    entityType: string;
    entityId: string;
    action: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    details?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: params.userId,
          entityType: params.entityType,
          entityId: params.entityId,
          action: params.action,
          oldValues: params.oldValues || undefined,
          newValues: params.newValues || undefined,
          ipAddress: params.ipAddress,
          details: params.details,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`);
    }
  }

  async logActivity(userId: string, action: string, description?: string) {
    try {
      await this.prisma.activityLog.create({
        data: {
          userId,
          action,
          description,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create activity log: ${error.message}`);
    }
  }
}
