import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class ProcurementService {
  private readonly logger = new Logger(ProcurementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async createVendor(data: {
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    category?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    const reliabilityScore = parseFloat((Math.random() * 30 + 70).toFixed(1));
    return this.prisma.vendor.create({ data: { tenantId, reliabilityScore, ...data } });
  }

  async createPurchaseOrder(data: {
    vendorId: string;
    poNumber: string;
    expectedDate?: Date;
    branchId?: string;
    items: Array<{ itemName: string; itemCode?: string; quantity: number; unitPrice: number; unit?: string }>;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const totalAmount = data.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

    return this.prisma.purchaseOrder.create({
      data: {
        tenantId,
        vendorId: data.vendorId,
        poNumber: data.poNumber,
        expectedDate: data.expectedDate,
        branchId: data.branchId,
        totalAmount,
        status: 'DRAFT',
        items: {
          create: data.items.map((i) => ({
            itemName: i.itemName,
            itemCode: i.itemCode,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.quantity * i.unitPrice,
            unit: i.unit,
          })),
        },
      },
      include: { items: true, vendor: true },
    });
  }

  async receiveGoods(poId: string, grnNumber: string, receivedBy?: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const grn = await this.prisma.goodsReceipt.create({
      data: { tenantId, poId, grnNumber, receivedBy, status: 'RECEIVED', qualityCheckDone: true },
    });

    await this.prisma.purchaseOrder.update({
      where: { id: poId },
      data: { status: 'RECEIVED', deliveredDate: new Date() },
    });

    return grn;
  }

  async getLowStockAlerts() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const allStocks = await this.prisma.inventoryStock.findMany({
      where: { tenantId },
      include: { warehouse: true },
    });
    return allStocks.filter((s) => s.quantity <= s.reorderLevel);
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const [vendors, openPOs, warehouses] = await Promise.all([
      this.prisma.vendor.count({ where: { tenantId, isActive: true } }),
      this.prisma.purchaseOrder.count({ where: { tenantId, status: { in: ['DRAFT', 'SENT', 'CONFIRMED'] } } }),
      this.prisma.warehouse.findMany({
        where: { tenantId },
        include: { _count: { select: { stocks: true } } },
      }),
    ]);

    const recentPOs = await this.prisma.purchaseOrder.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { vendor: true, items: true },
    });

    return { vendors, openPOs, warehouses, recentPOs };
  }
}
