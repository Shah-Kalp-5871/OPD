import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCdsRuleDto, EvaluateCdsDto } from './dto/cds-rule.dto';

@Injectable()
export class CdsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRule(tenantId: string, dto: CreateCdsRuleDto) {
    return this.prisma.cdsRule.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        condition: dto.condition,
        action: dto.action,
        severity: dto.severity || 'INFO',
      },
    });
  }

  async getRules(tenantId: string) {
    return this.prisma.cdsRule.findMany({ where: { tenantId, isActive: true } });
  }

  async evaluate(tenantId: string, dto: EvaluateCdsDto) {
    const rules = await this.getRules(tenantId);
    const recommendations: any[] = [];

    for (const rule of rules) {
      // Basic mock evaluation logic for the engine
      const condition = rule.condition as Record<string, any>;
      const isMatch = Object.keys(condition).every((key) => dto.context[key] === condition[key]);

      if (isMatch) {
        const action = rule.action as Record<string, any>;
        const recommendation = await this.prisma.cdsRecommendation.create({
          data: {
            tenantId,
            patientId: dto.patientId,
            encounterId: dto.encounterId,
            ruleId: rule.id,
            suggestion: action.suggestion || 'Recommended Action',
            severity: rule.severity,
          },
        });
        recommendations.push(recommendation);
      }
    }

    return recommendations;
  }
}
