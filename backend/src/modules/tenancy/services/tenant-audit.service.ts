import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TenantAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log({
    tenantId,
    userId,
    action,
    details,
    ipAddress,
    userAgent,
  }: {
    tenantId: string;
    userId?: string;
    action: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.tenantAuditLog.create({
      data: {
        tenantId,
        userId: userId || null,
        action,
        details: details || {},
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  }
}
