import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class WorkforceService {
  private readonly logger = new Logger(WorkforceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async createShift(data: {
    name: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    departmentId?: string;
    branchId?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.shift.create({ data: { tenantId, ...data } });
  }

  async assignShift(employeeId: string, shiftId: string, date: Date) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.shiftAssignment.create({
      data: { tenantId, employeeId, shiftId, date },
    });
  }

  async submitLeaveRequest(data: {
    employeeId: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    days: number;
    reason?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.leaveRequest.create({ data: { tenantId, ...data } });
  }

  async approveLeave(id: string, approvedBy: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy, approvedAt: new Date() },
    });
  }

  async generateStaffingForecast(department: string, forecastDate: Date, branchId?: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Generating AI staffing forecast for ${department}`);

    // AI-simulated staffing demand
    const predictedPatientLoad = Math.floor(Math.random() * 200) + 50;
    const requiredStaff = Math.ceil(predictedPatientLoad / 15);
    const riskLevel = requiredStaff > 20 ? 'HIGH' : requiredStaff > 12 ? 'MEDIUM' : 'LOW';
    const aiRecommendations = {
      peakHours: ['09:00-12:00', '16:00-19:00'],
      suggestedOvertimeStaff: Math.ceil(requiredStaff * 0.1),
      burnoutRisk: riskLevel === 'HIGH' ? 'Elevated — recommend cross-training relief staff' : 'Normal',
      specialNotes: `${department} expected high patient load on ${forecastDate.toDateString()}`,
    };

    return this.prisma.staffingForecast.create({
      data: { tenantId, branchId, department, forecastDate, requiredStaff, predictedPatientLoad, riskLevel, aiRecommendations },
    });
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const [pendingLeaves, shifts, forecasts] = await Promise.all([
      this.prisma.leaveRequest.count({ where: { tenantId, status: 'PENDING' } }),
      this.prisma.shift.findMany({ where: { tenantId, isActive: true } }),
      this.prisma.staffingForecast.findMany({
        where: { tenantId },
        orderBy: { forecastDate: 'desc' },
        take: 5,
      }),
    ]);

    return { pendingLeaves, totalShifts: shifts.length, forecasts };
  }
}
