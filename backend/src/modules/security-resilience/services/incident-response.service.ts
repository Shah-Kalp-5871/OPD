import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class IncidentResponseService {
  private readonly logger = new Logger(IncidentResponseService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  // --- Incident Playbooks ---
  async getPlaybooks() {
    const tenantId = this.getTenantId();
    let playbooks = await this.prisma.incidentPlaybook.findMany({
      where: { tenantId },
    });

    if (playbooks.length === 0) {
      // Create defaults
      await this.prisma.incidentPlaybook.createMany({
        data: [
          {
            tenantId,
            triggerType: 'RANSOMWARE',
            playbookName: 'Ransomware Containment & Eradication Playbook',
            actions: [
              { step: 1, name: 'Quarantine infected endpoint device', type: 'AUTOMATED_CONTAIN' },
              { step: 2, name: 'Disable infected user credentials', type: 'AUTOMATED_REVOKE' },
              { step: 3, name: 'Capture live forensic RAM dump', type: 'FORENSICS' },
              { step: 4, name: 'Trigger emergency cloud backup check', type: 'BACKUP_DR' },
            ],
            isActive: true,
          },
          {
            tenantId,
            triggerType: 'PHI_BREACH',
            playbookName: 'HIPAA PHI Breach Legal Incident Playbook',
            actions: [
              { step: 1, name: 'Isolate compromised database server logs', type: 'SIEM_LOCK' },
              { step: 2, name: 'Calculate absolute patient records count leaked', type: 'AUDIT_CALC' },
              { step: 3, name: 'Notify legal counsel and executive CISO lead', type: 'ESCALATION' },
            ],
            isActive: true,
          },
        ],
      });
      playbooks = await this.prisma.incidentPlaybook.findMany({
        where: { tenantId },
      });
    }
    return playbooks;
  }

  async triggerPlaybook(incidentId: string, playbookId: string) {
    const tenantId = this.getTenantId();
    const playbook = await this.prisma.incidentPlaybook.findFirst({
      where: { id: playbookId, tenantId },
    });

    if (!playbook) {
      throw new NotFoundException(`Playbook ${playbookId} not found`);
    }

    // Generate incident tasks based on playbook actions
    const actions = playbook.actions as any[];
    const tasks: any[] = [];
    for (const action of actions) {
      const task = await this.prisma.incidentTask.create({
        data: {
          tenantId,
          incidentId,
          taskName: action.name,
          status: 'PENDING',
        },
      });
      tasks.push(task);
    }

    return { playbookName: playbook.playbookName, tasks };
  }

  // --- Incident Tasks ---
  async getTasks(incidentId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.incidentTask.findMany({
      where: { tenantId, incidentId },
    });
  }

  async updateTaskStatus(taskId: string, status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED', assignee?: string) {
    const tenantId = this.getTenantId();
    const task = await this.prisma.incidentTask.findFirst({
      where: { id: taskId, tenantId },
    });

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    const updates: any = { status };
    if (status === 'RUNNING') {
      updates.startedAt = new Date();
    } else if (status === 'COMPLETED' || status === 'FAILED') {
      updates.completedAt = new Date();
    }
    if (assignee) {
      updates.assignedTo = assignee;
    }

    return this.prisma.incidentTask.update({
      where: { id: taskId },
      data: updates,
    });
  }

  // --- Escalation Management ---
  async getEscalations(incidentId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.incidentEscalation.findMany({
      where: { tenantId, incidentId },
    });
  }

  async triggerEscalation(incidentId: string, data: { escalatedTo: string; reason: string }) {
    const tenantId = this.getTenantId();
    return this.prisma.incidentEscalation.create({
      data: {
        tenantId,
        incidentId,
        escalatedTo: data.escalatedTo,
        reason: data.reason,
        status: 'ACTIVE',
      },
    });
  }

  // --- Forensics & Audit Artifacts ---
  async getForensicArtifacts(incidentId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.forensicArtifact.findMany({
      where: { tenantId, incidentId },
    });
  }

  async uploadForensicArtifact(
    incidentId: string,
    data: { artifactType: string; fileName: string; capturedBy: string },
  ) {
    const tenantId = this.getTenantId();
    return this.prisma.forensicArtifact.create({
      data: {
        tenantId,
        incidentId,
        artifactType: data.artifactType,
        fileUrl: `s3://medflow-forensics/${tenantId}/incidents/${incidentId}/${data.fileName}`,
        checksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // Placeholder
        capturedBy: data.capturedBy,
      },
    });
  }
}
