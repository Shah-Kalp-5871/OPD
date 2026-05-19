import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TenantContextService } from '../../../tenancy/tenant-context.service';

@Injectable()
export class WarehouseIngestionService {
  private readonly logger = new Logger(WarehouseIngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  private formatDateId(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }

  async ensureDateDimension(date: Date): Promise<string> {
    const dateId = this.formatDateId(date);
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    const year = date.getFullYear();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    await this.prisma.analyticsDimensionDate.upsert({
      where: { dateId },
      create: {
        dateId,
        date,
        dayOfWeek,
        dayOfMonth,
        month,
        quarter,
        year,
        isWeekend,
        isHoliday: false,
      },
      update: {},
    });

    return dateId;
  }

  async ensureBranchDimension(branchId: string): Promise<string> {
    const tenantId = this.getTenantId();
    const exists = await this.prisma.analyticsDimensionBranch.findUnique({
      where: { id: branchId },
    });

    if (!exists) {
      await this.prisma.analyticsDimensionBranch.create({
        data: {
          id: branchId,
          tenantId,
          branchName: `Branch ${branchId.substring(0, 8)}`,
          region: 'Default Region',
          country: 'Default Country',
        },
      });
    }

    return branchId;
  }

  async ensureDepartmentDimension(deptId: string): Promise<string> {
    const tenantId = this.getTenantId();
    const exists = await this.prisma.analyticsDimensionDepartment.findUnique({
      where: { id: deptId },
    });

    if (!exists) {
      await this.prisma.analyticsDimensionDepartment.create({
        data: {
          id: deptId,
          tenantId,
          departmentName: `Dept ${deptId.substring(0, 8)}`,
          clinical: true,
        },
      });
    }

    return deptId;
  }

  async ingestAppointment(appointmentId: string): Promise<void> {
    const tenantId = this.getTenantId();
    try {
      // Find source appointment defensively using raw query or dynamic find to support diverse clinical schemas
      const appointment: any = await this.prisma.$queryRawUnsafe(
        `SELECT * FROM "Appointment" WHERE id = $1 AND "tenantId" = $2 LIMIT 1`,
        appointmentId,
        tenantId,
      ).then((res: any) => res?.[0]);

      if (!appointment) return;

      const dateVal = new Date(appointment.appointmentDate || appointment.createdAt || new Date());
      const dateId = await this.ensureDateDimension(dateVal);
      const branchId = await this.ensureBranchDimension(appointment.branchId || 'default-branch');
      const departmentId = await this.ensureDepartmentDimension(appointment.departmentId || 'default-dept');

      await this.prisma.analyticsFactAppointment.upsert({
        where: { appointmentId },
        create: {
          tenantId,
          appointmentId,
          dateId,
          branchId,
          departmentId,
          patientId: appointment.patientId || 'unknown-patient',
          doctorId: appointment.doctorId || 'unknown-doctor',
          status: appointment.status || 'PENDING',
          waitTimeMinutes: appointment.waitTimeMinutes || null,
          consultMinutes: appointment.consultMinutes || null,
          isTelemedicine: appointment.isTelemedicine || false,
          isFollowUp: appointment.isFollowUp || false,
        },
        update: {
          status: appointment.status || 'PENDING',
          waitTimeMinutes: appointment.waitTimeMinutes || null,
          consultMinutes: appointment.consultMinutes || null,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to ingest appointment ${appointmentId}: ${err.message}`);
    }
  }

  async ingestRevenue(invoiceId: string): Promise<void> {
    const tenantId = this.getTenantId();
    try {
      const invoice: any = await this.prisma.$queryRawUnsafe(
        `SELECT * FROM "Invoice" WHERE id = $1 AND "tenantId" = $2 LIMIT 1`,
        invoiceId,
        tenantId,
      ).then((res: any) => res?.[0]);

      if (!invoice) return;

      const dateVal = new Date(invoice.createdAt || new Date());
      const dateId = await this.ensureDateDimension(dateVal);
      const branchId = await this.ensureBranchDimension(invoice.branchId || 'default-branch');
      const departmentId = await this.ensureDepartmentDimension(invoice.departmentId || 'default-dept');

      await this.prisma.analyticsFactRevenue.upsert({
        where: { invoiceId },
        create: {
          tenantId,
          invoiceId,
          dateId,
          branchId,
          departmentId,
          patientId: invoice.patientId || 'unknown-patient',
          revenueType: invoice.revenueType || 'OPD',
          amountBilled: Number(invoice.amountBilled || invoice.total || 0),
          amountCollected: Number(invoice.amountCollected || invoice.paid || 0),
          discountGiven: Number(invoice.discountGiven || invoice.discount || 0),
          insuranceClaimed: Number(invoice.insuranceClaimed || 0),
        },
        update: {
          amountBilled: Number(invoice.amountBilled || invoice.total || 0),
          amountCollected: Number(invoice.amountCollected || invoice.paid || 0),
          discountGiven: Number(invoice.discountGiven || invoice.discount || 0),
          insuranceClaimed: Number(invoice.insuranceClaimed || 0),
        },
      });
    } catch (err) {
      this.logger.error(`Failed to ingest revenue invoice ${invoiceId}: ${err.message}`);
    }
  }

  async ingestPatient(patientId: string): Promise<void> {
    const tenantId = this.getTenantId();
    try {
      const patient: any = await this.prisma.$queryRawUnsafe(
        `SELECT * FROM "Patient" WHERE id = $1 LIMIT 1`,
        patientId,
      ).then((res: any) => res?.[0]);

      if (!patient) return;

      const dateVal = new Date(patient.createdAt || new Date());
      const dateId = await this.ensureDateDimension(dateVal);
      const branchId = await this.ensureBranchDimension(patient.branchId || 'default-branch');

      await this.prisma.analyticsFactPatient.upsert({
        where: { patientId },
        create: {
          tenantId,
          patientId,
          dateId,
          branchId,
          ageAtReg: patient.age || null,
          gender: patient.gender || null,
          acquisitionChannel: patient.acquisitionChannel || 'WALK_IN',
          isChronic: patient.isChronic || false,
        },
        update: {
          isChronic: patient.isChronic || false,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to ingest patient ${patientId}: ${err.message}`);
    }
  }

  async ingestPrescription(prescriptionId: string): Promise<void> {
    const tenantId = this.getTenantId();
    try {
      const prescription: any = await this.prisma.$queryRawUnsafe(
        `SELECT * FROM "Prescription" WHERE id = $1 LIMIT 1`,
        prescriptionId,
      ).then((res: any) => res?.[0]);

      if (!prescription) return;

      const dateVal = new Date(prescription.createdAt || new Date());
      const dateId = await this.ensureDateDimension(dateVal);
      const branchId = await this.ensureBranchDimension(prescription.branchId || 'default-branch');

      await this.prisma.analyticsFactPrescription.upsert({
        where: { prescriptionId },
        create: {
          tenantId,
          prescriptionId,
          dateId,
          branchId,
          doctorId: prescription.doctorId || 'unknown-doctor',
          patientId: prescription.patientId || 'unknown-patient',
          itemCount: prescription.itemCount || 1,
          antibioticCount: prescription.antibioticCount || 0,
          controlledCount: prescription.controlledCount || 0,
          dispensed: prescription.dispensed || false,
        },
        update: {
          dispensed: prescription.dispensed || false,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to ingest prescription ${prescriptionId}: ${err.message}`);
    }
  }

  async ingestAdmission(admissionId: string): Promise<void> {
    const tenantId = this.getTenantId();
    try {
      const admission: any = await this.prisma.$queryRawUnsafe(
        `SELECT * FROM "Admission" WHERE id = $1 LIMIT 1`,
        admissionId,
      ).then((res: any) => res?.[0]);

      if (!admission) return;

      const dateVal = new Date(admission.admissionDate || admission.createdAt || new Date());
      const dateId = await this.ensureDateDimension(dateVal);
      const branchId = await this.ensureBranchDimension(admission.branchId || 'default-branch');

      await this.prisma.analyticsFactAdmission.upsert({
        where: { admissionId },
        create: {
          tenantId,
          admissionId,
          dateId,
          branchId,
          patientId: admission.patientId || 'unknown-patient',
          departmentId: admission.departmentId || null,
          lengthOfStayHrs: admission.lengthOfStayHrs || null,
          readmission: admission.readmission || false,
          dischargeStatus: admission.dischargeStatus || null,
          icuDays: admission.icuDays || 0,
        },
        update: {
          lengthOfStayHrs: admission.lengthOfStayHrs || null,
          dischargeStatus: admission.dischargeStatus || null,
          icuDays: admission.icuDays || 0,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to ingest admission ${admissionId}: ${err.message}`);
    }
  }
}
