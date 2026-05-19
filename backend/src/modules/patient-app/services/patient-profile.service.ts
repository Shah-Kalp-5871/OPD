import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PatientProfileService {
  private readonly logger = new Logger(PatientProfileService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getProfile(patientId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.patientProfile.findFirst({
      where: { patientId, patient: { isActive: true } },
      include: { patient: true },
    });
  }

  async updateProfile(patientId: string, data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.patientProfile.upsert({
      where: { patientId },
      update: {
        dob: data.dob ? new Date(data.dob) : undefined,
        bloodGroup: data.bloodGroup,
        address: data.address,
        city: data.city,
        state: data.state,
        maritalStatus: data.maritalStatus,
        photo: data.photo,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNo: data.emergencyContactNo,
      },
      create: {
        patientId,
        dob: data.dob ? new Date(data.dob) : undefined,
        bloodGroup: data.bloodGroup,
        address: data.address,
        city: data.city,
        state: data.state,
        maritalStatus: data.maritalStatus,
        photo: data.photo,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNo: data.emergencyContactNo,
      },
    });
  }
}