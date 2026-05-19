import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class NpsAnalyticsService {
  private readonly logger = new Logger(NpsAnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getScores() {
    const tenantId = this.getTenantId();
    let scores = await this.prisma.npsScore.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    if (scores.length === 0) {
      const defaultScores = [
        { score: 9, feedbackText: 'Exceptional digital checkout flow.', sentimentCategory: 'PROMOTER' },
        { score: 10, feedbackText: 'The AI virtual triage checker accurately recommended clinical consults.', sentimentCategory: 'PROMOTER' },
        { score: 6, feedbackText: 'Wait times at the laboratory queue could be improved.', sentimentCategory: 'DETRACTOR' },
      ];

      for (const s of defaultScores) {
        await this.prisma.npsScore.create({
          data: {
            tenantId,
            patientId: 'patient-' + Math.random().toString(36).substring(4),
            ...s,
          },
        });
      }
      scores = await this.prisma.npsScore.findMany({
        where: { tenantId },
      });
    }

    return scores;
  }

  async logNps(patientId: string, score: number, feedbackText?: string) {
    const tenantId = this.getTenantId();
    let cat = 'PASSIVE';
    if (score >= 9) cat = 'PROMOTER';
    else if (score <= 6) cat = 'DETRACTOR';

    return this.prisma.npsScore.create({
      data: {
        tenantId,
        patientId,
        score,
        feedbackText,
        sentimentCategory: cat,
      },
    });
  }
}