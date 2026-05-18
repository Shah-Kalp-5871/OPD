import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class PayrollService {
  private readonly logger = new Logger(PayrollService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async initiateCycle(month: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.payrollCycle.upsert({
      where: { tenantId_month: { tenantId, month } },
      update: { status: 'PROCESSING' },
      create: { tenantId, month, status: 'PROCESSING' },
    });
  }

  async processPayroll(month: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Processing payroll for ${month}`);

    const cycle = await this.prisma.payrollCycle.upsert({
      where: { tenantId_month: { tenantId, month } },
      update: { status: 'PROCESSING' },
      create: { tenantId, month, status: 'PROCESSING' },
    });

    const employees = await this.prisma.employee.findMany({
      where: { tenantId, status: 'ACTIVE' },
      include: { salaryStructure: true },
    });

    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    for (const emp of employees) {
      if (!emp.salaryStructure) continue;

      const basicPay = emp.salaryStructure.basicSalary;
      const allowances = emp.salaryStructure.hra + 3000; // HRA + transport
      const grossPay = basicPay + allowances;
      const taxDeduction = grossPay * 0.1;
      const pfDeduction = basicPay * 0.12;
      const netPay = grossPay - taxDeduction - pfDeduction;

      await this.prisma.payrollRecord.create({
        data: {
          tenantId,
          cycleId: cycle.id,
          employeeId: emp.id,
          basicPay,
          allowances,
          grossPay,
          taxDeduction,
          pfDeduction,
          netPay,
          status: 'PENDING',
        },
      });

      totalGross += grossPay;
      totalDeductions += taxDeduction + pfDeduction;
      totalNet += netPay;
    }

    return this.prisma.payrollCycle.update({
      where: { id: cycle.id },
      data: { status: 'APPROVED', totalGrossPay: totalGross, totalDeductions, totalNetPay: totalNet, processedAt: new Date() },
    });
  }

  async submitReimbursement(data: {
    employeeId: string;
    category: string;
    amount: number;
    description: string;
    receiptUrl?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.reimbursementClaim.create({ data: { tenantId, ...data } });
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const [recentCycles, pendingClaims] = await Promise.all([
      this.prisma.payrollCycle.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      this.prisma.reimbursementClaim.count({ where: { tenantId, status: 'PENDING' } }),
    ]);

    return { recentCycles, pendingClaims };
  }
}
