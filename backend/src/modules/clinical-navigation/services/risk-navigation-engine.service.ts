import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class RiskNavigationEngineService {
  private readonly logger = new Logger(RiskNavigationEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getRiskSignals(patientId?: string) {
    const tenantId = this.getTenantId();
    let signals = await this.prisma.careRiskSignal.findMany({
      where: {
        tenantId,
        patientId: patientId ? patientId : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (signals.length === 0 && patientId) {
      // Create seed signals for demo patient
      const defaults = [
        { signalType: 'READMISSION_RISK', riskScore: 78.4, indicators: ['Unstable blood pressure', 'Multiple high-dose medications', 'Missed follow-up appt'] },
        { signalType: 'DROP_OUT_RISK', riskScore: 42.0, indicators: ['Long commute', 'Low active portal engagement'] },
        { signalType: 'TREATMENT_ADHERENCE', riskScore: 84.1, indicators: ['Missed medication refill validation'] },
      ];

      for (const item of defaults) {
        const signal = await this.prisma.careRiskSignal.create({
          data: {
            tenantId,
            patientId,
            signalType: item.signalType,
            riskScore: item.riskScore,
            indicators: item.indicators,
          },
        });
        signals.push(signal);
      }
    }

    return signals;
  }

  async addressSignal(id: string) {
    const tenantId = this.getTenantId();
    return this.prisma.careRiskSignal.updateMany({
      where: { id, tenantId },
      data: { isAddressed: true },
    });
  }
}
