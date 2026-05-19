import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PatientPreferencesService {
  private readonly logger = new Logger(PatientPreferencesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getPreferences(patientId: string) {
    const tenantId = this.getTenantId();
    let preference = await this.prisma.patientPreference.findFirst({
      where: { tenantId, patientId },
    });

    if (!preference) {
      preference = await this.prisma.patientPreference.create({
        data: {
          tenantId,
          patientId,
          language: 'en',
          theme: 'light',
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          whatsAppNotifications: true,
        },
      });
    }
    return preference;
  }

  async updatePreferences(patientId: string, data: any) {
    const tenantId = this.getTenantId();
    const existing = await this.getPreferences(patientId);

    return this.prisma.patientPreference.update({
      where: { id: existing.id },
      data: {
        language: data.language,
        theme: data.theme,
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        pushNotifications: data.pushNotifications,
        whatsAppNotifications: data.whatsAppNotifications,
      },
    });
  }
}