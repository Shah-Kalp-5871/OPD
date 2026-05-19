import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PartnerBillingService {
  private readonly logger = new Logger(PartnerBillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async createInvoice(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.partnerBillingInvoice.create({
      data: {
        tenantId,
        appId: data.appId,
        invoiceNumber: data.invoiceNumber || `INV-APP-${Date.now()}`,
        amount: data.amount,
        dueDate: new Date(data.dueDate || Date.now() + 15 * 24 * 60 * 60 * 1000), // default 15 days
        status: 'UNPAID',
      },
    });
  }

  async payInvoice(invoiceId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.partnerBillingInvoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
      },
    });
  }

  async getInvoices() {
    const tenantId = this.getTenantId();
    return this.prisma.partnerBillingInvoice.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
