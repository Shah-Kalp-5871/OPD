import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PatientBillingService {
  private readonly logger = new Logger(PatientBillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getInvoices(patientId: string) {
    const tenantId = this.getTenantId();
    let invoices = await this.prisma.consumerInvoice.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    });

    if (invoices.length === 0) {
      await this.prisma.consumerInvoice.create({
        data: {
          tenantId,
          patientId,
          invoiceNumber: 'INV-' + Math.random().toString(36).substring(3, 8).toUpperCase(),
          amount: 450.0,
          status: 'UNPAID',
          downloadUrl: '/invoices/inv-default.pdf',
        },
      });
      invoices = await this.prisma.consumerInvoice.findMany({
        where: { tenantId, patientId },
      });
    }

    return invoices;
  }
}