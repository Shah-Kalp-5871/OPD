import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class WorkflowAiService {
  private readonly logger = new Logger(WorkflowAiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  async triggerWorkflow(triggerType: string, payload: any) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Evaluating AI Workflow Rules for trigger: ${triggerType}`);

    // Fetch active rules matching the trigger
    const activeRules = await this.prisma.workflowRule.findMany({
      where: { tenantId, isActive: true, triggerType }
    });

    for (const rule of activeRules) {
      // Very basic rule engine evaluation simulation
      const conditions: any = rule.conditions;
      let matched = false;

      if (triggerType === 'HIGH_RISK_ALERT') {
        if (payload.riskScore >= conditions.minScore) {
          matched = true;
        }
      } else if (triggerType === 'LAB_RESULT_ABNORMAL') {
        if (payload.isAbnormal) matched = true;
      }

      if (matched) {
        this.logger.warn(`Rule "${rule.name}" Matched! Executing Actions...`);
        const actions: any = rule.actions;

        for (const action of actions) {
          await this.executeAction(action, payload, tenantId);
        }
      }
    }
  }

  private async executeAction(action: any, payload: any, tenantId: string) {
    if (action.type === 'CREATE_TASK') {
      await this.prisma.workflowTask.create({
        data: {
          tenantId,
          taskType: action.taskType, // e.g. 'DOCTOR_ASSIGNMENT'
          payload: payload,
          status: 'PENDING',
          assignedUserId: action.assignToGroup === 'CARDIOLOGY' ? 'dr-001' : null
        }
      });
      this.logger.log(`Created Workflow Task: ${action.taskType}`);
    } else if (action.type === 'AUTO_ROUTE') {
      this.logger.log(`Auto routing patient ${payload.patientId} to ${action.destination}`);
    }
  }

  async getTasks() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.workflowTask.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }
}
