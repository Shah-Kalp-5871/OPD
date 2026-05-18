import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class HrmsService {
  private readonly logger = new Logger(HrmsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async createEmployee(data: {
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    departmentId?: string;
    designationId?: string;
    joiningDate: Date;
    employmentType?: string;
    branchId?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Onboarding employee ${data.employeeCode}`);
    return this.prisma.employee.create({
      data: { tenantId, ...data },
    });
  }

  async getEmployees(filters?: { status?: string; departmentId?: string; branchId?: string }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    return this.prisma.employee.findMany({
      where: {
        tenantId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.departmentId && { departmentId: filters.departmentId }),
        ...(filters?.branchId && { branchId: filters.branchId }),
      },
      include: {
        department: true,
        designation: true,
        certifications: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async recordAttendance(employeeId: string, date: Date, checkIn?: Date, checkOut?: Date, status?: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const hoursWorked = checkIn && checkOut
      ? (checkOut.getTime() - checkIn.getTime()) / 3_600_000
      : undefined;

    return this.prisma.employeeAttendance.upsert({
      where: { tenantId_employeeId_date: { tenantId, employeeId, date } },
      update: { checkIn, checkOut, status: status ?? 'PRESENT', hoursWorked },
      create: { tenantId, employeeId, date, checkIn, checkOut, status: status ?? 'PRESENT', hoursWorked },
    });
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const [totalEmployees, activeEmployees, onLeave, expiringSoon] = await Promise.all([
      this.prisma.employee.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.employee.count({ where: { tenantId, status: 'ON_LEAVE' } }),
      this.prisma.employeeCertification.count({
        where: {
          employee: { tenantId },
          status: 'EXPIRING_SOON',
        },
      }),
    ]);

    const departments = await this.prisma.hrmsDepartment.findMany({
      where: { tenantId },
      include: { _count: { select: { employees: true } } },
    });

    return { totalEmployees, activeEmployees, onLeave, expiringSoon, departments };
  }

  async createDepartment(name: string, code: string, branchId?: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.hrmsDepartment.create({ data: { tenantId, name, code, branchId } });
  }

  async getDepartments() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.hrmsDepartment.findMany({ where: { tenantId, isActive: true } });
  }
}
