import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class OperationalOptimizationService {
  private readonly logger = new Logger(OperationalOptimizationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getOptimizationPolicies() {
    const tenantId = this.getTenantId();
    let policies = await this.prisma.optimizationPolicy.findMany({
      where: { tenantId },
    });

    if (policies.length === 0) {
      // Seed default optimization policies
      const defaults = [
        { policyName: 'Staff Dynamic Allocation', parameterKey: 'nurse_to_patient_ratio', currentValue: '1:6', optimalValue: '1:4', isAutoApply: true },
        { policyName: 'Triage Ingestion Capacity', parameterKey: 'max_triage_wait_time', currentValue: '45m', optimalValue: '15m', isAutoApply: false },
        { policyName: 'Bed Turnover Optimizer', parameterKey: 'avg_discharge_cleanup_delay', currentValue: '120m', optimalValue: '30m', isAutoApply: true },
      ];

      for (const item of defaults) {
        const policy = await this.prisma.optimizationPolicy.create({
          data: {
            tenantId,
            policyName: item.policyName,
            parameterKey: item.parameterKey,
            currentValue: item.currentValue,
            optimalValue: item.optimalValue,
            isAutoApply: item.isAutoApply,
          },
        });
        policies.push(policy);
      }
    }

    return policies;
  }

  async updatePolicy(id: string, data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.optimizationPolicy.updateMany({
      where: { id, tenantId },
      data: {
        currentValue: data.currentValue,
        optimalValue: data.optimalValue,
        isAutoApply: data.isAutoApply,
      },
    });
  }

  async getWorkflowExecutions() {
    const tenantId = this.getTenantId();
    return this.prisma.autonomousWorkflowExecution.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async triggerOptimizationWorkflow(name: string, triggerEvent: string) {
    const tenantId = this.getTenantId();
    return this.prisma.autonomousWorkflowExecution.create({
      data: {
        tenantId,
        workflowName: name,
        triggerEvent,
        stepsRun: {
          step1: 'Assess real-time floor occupancy',
          step2: 'Detect deficit parameters',
          step3: 'Allocate float pool clinical staff',
          step4: 'Dispatch emergency mobile warning notification',
        },
        executionTime: 240,
        status: 'SUCCESS',
      },
    });
  }
}
