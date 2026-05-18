import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VirtualHospitalService {
  constructor(private readonly prisma: PrismaService) {}

  async admitPatient(tenantId: string, patientId: string, assignedTo: string, careLevel: string) {
    const riskScore = await this.calculateRiskScore(tenantId, patientId);

    return this.prisma.virtualAdmission.create({
      data: { tenantId, patientId, assignedTo, careLevel, riskScore },
    });
  }

  async dischargePatient(tenantId: string, admissionId: string) {
    const admission = await this.prisma.virtualAdmission.findFirst({ where: { id: admissionId, tenantId } });
    if (!admission) throw new NotFoundException('Admission not found');

    return this.prisma.virtualAdmission.update({
      where: { id: admissionId },
      data: { status: 'DISCHARGED', dischargedAt: new Date() },
    });
  }

  async escalatePatient(tenantId: string, admissionId: string) {
    return this.prisma.virtualAdmission.updateMany({
      where: { id: admissionId, tenantId },
      data: { status: 'ESCALATED', careLevel: 'EMERGENCY' },
    });
  }

  async createTask(tenantId: string, admissionId: string, title: string, type: string, assignedTo?: string, dueAt?: Date) {
    return this.prisma.careTask.create({
      data: { tenantId, admissionId, title, type, assignedTo, dueAt },
    });
  }

  async completeTask(tenantId: string, taskId: string) {
    return this.prisma.careTask.updateMany({
      where: { id: taskId, tenantId },
      data: { status: 'DONE', completedAt: new Date() },
    });
  }

  async getAdmissions(tenantId: string) {
    return this.prisma.virtualAdmission.findMany({
      where: { tenantId, status: 'ACTIVE' },
      include: { tasks: true },
      orderBy: { admittedAt: 'desc' },
    });
  }

  async getMissedTasks(tenantId: string) {
    const now = new Date();
    return this.prisma.careTask.findMany({
      where: { tenantId, status: 'PENDING', dueAt: { lt: now } },
      orderBy: { dueAt: 'asc' },
    });
  }

  private async calculateRiskScore(tenantId: string, patientId: string): Promise<number> {
    // Base risk score — enhanced with RPM readings in production
    const recentAlerts = await this.prisma.rpmAlert.count({
      where: { tenantId, patientId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
    return Math.min(100, recentAlerts * 15);
  }
}
