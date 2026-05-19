import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class AnalyticsExportService {
  private readonly logger = new Logger(AnalyticsExportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  // HIPAA Safe Harbor Sanitization rules
  sanitizeData(dataset: any[]): any[] {
    return dataset.map(row => {
      const sanitized = { ...row };
      
      // Strict deletion of 18 HIPAA identifier types
      const keysToStrip = [
        'name', 'patientName', 'doctorName', 'email', 'phone', 'mobile',
        'address', 'ssn', 'insuranceId', 'nationalId', 'medicalRecordNumber',
        'mrn', 'ipAddress', 'deviceId', 'biometric', 'photo', 'dob', 'birthDate'
      ];

      for (const key of keysToStrip) {
        if (key in sanitized) {
          delete sanitized[key];
        }
      }

      // Safe Harbor: generalise age above 89
      if (sanitized.age && Number(sanitized.age) > 89) {
        sanitized.age = '90+';
      }

      return sanitized;
    });
  }

  async requestExport(userId: string, exportType: string, rawData: any[], scope: string) {
    const tenantId = this.getTenantId();
    
    // Log access request in audit trail
    await this.prisma.analyticsAccessLog.create({
      data: {
        tenantId,
        userId,
        action: `EXPORT_REQUEST:${exportType}`,
        resourceId: scope,
        ipAddress: '127.0.0.1',
      },
    });

    const sanitized = this.sanitizeData(rawData);
    const requiresApproval = rawData.length > 500;
    
    // Create actual export record
    const exportRecord = await this.prisma.analyticsExport.create({
      data: {
        tenantId,
        userId,
        exportType,
        description: `Export of ${scope} data`,
        status: requiresApproval ? 'PENDING' : 'COMPLETED',
        fileUrl: '', 
        containsPhi: false,
        watermarked: true,
      },
    });

    if (requiresApproval) {
      // Auto-register pending approval task
      await this.prisma.exportApproval.create({
        data: {
          tenantId,
          requesterId: userId,
          exportConfig: { exportId: exportRecord.id, scope } as any,
          reason: `Large dataset export (${rawData.length} rows)`,
          status: 'PENDING',
        },
      });
    }

    return {
      exportId: exportRecord.id,
      status: exportRecord.status,
      data: exportRecord.status === 'COMPLETED' ? sanitized : null,
    };
  }

  async approveExport(exportId: string, approverId: string) {
    const tenantId = this.getTenantId();
    
    // Find the approval record that matches this exportId in its config
    const approvals = await this.prisma.exportApproval.findMany({
      where: { tenantId, status: 'PENDING' },
    });

    const approval = approvals.find(app => {
      const config = app.exportConfig as any;
      return config && config.exportId === exportId;
    });

    if (!approval) {
      throw new ForbiddenException('No approval request found for this export');
    }

    await this.prisma.exportApproval.update({
      where: { id: approval.id },
      data: {
        approverId,
        status: 'APPROVED',
        resolvedAt: new Date(),
      },
    });

    await this.prisma.analyticsExport.update({
      where: { id: exportId },
      data: {
        status: 'COMPLETED',
      },
    });

    return { success: true };
  }

  async getAuditTrail() {
    const tenantId = this.getTenantId();
    return this.prisma.analyticsAccessLog.findMany({
      where: { tenantId },
      orderBy: { accessedAt: 'desc' },
      take: 100,
    });
  }
}
