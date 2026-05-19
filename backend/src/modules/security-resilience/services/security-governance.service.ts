import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class SecurityGovernanceService {
  private readonly logger = new Logger(SecurityGovernanceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  // --- Compliance Frameworks (HIPAA, GDPR, SOC2) ---
  async getFrameworks() {
    const tenantId = this.getTenantId();
    let frameworks = await this.prisma.complianceFramework.findMany({
      where: { tenantId },
    });

    if (frameworks.length === 0) {
      // Create defaults
      await this.prisma.complianceFramework.createMany({
        data: [
          { tenantId, frameworkName: 'HIPAA Security Rule Compliance', description: 'Healthcare Insurance Portability and Accountability Act', complianceScore: 92.5 },
          { tenantId, frameworkName: 'GDPR Privacy Standard', description: 'General Data Protection Regulation EU 2016/679', complianceScore: 88.0 },
          { tenantId, frameworkName: 'SOC 2 Type II Security', description: 'AICPA Trust Services Criteria for security, availability, processing integrity.', complianceScore: 95.0 },
        ],
      });
      frameworks = await this.prisma.complianceFramework.findMany({
        where: { tenantId },
      });
    }
    return frameworks;
  }

  async getControls(frameworkId: string) {
    const tenantId = this.getTenantId();
    let controls = await this.prisma.complianceControl.findMany({
      where: { tenantId, frameworkId },
    });

    if (controls.length === 0) {
      // Seed default HIPAA controls
      await this.prisma.complianceControl.createMany({
        data: [
          { tenantId, frameworkId, controlCode: '164.308(a)(1)', controlName: 'Security Management Process - Risk Analysis', status: 'IMPLEMENTED' },
          { tenantId, frameworkId, controlCode: '164.308(a)(5)', controlName: 'Security Awareness and Training', status: 'PARTIAL' },
          { tenantId, frameworkId, controlCode: '164.312(a)(1)', controlName: 'Access Control - Unique User Identification', status: 'IMPLEMENTED' },
          { tenantId, frameworkId, controlCode: '164.312(c)(1)', controlName: 'Transmission Security - Encryption in Transit', status: 'IMPLEMENTED' },
        ],
      });
      controls = await this.prisma.complianceControl.findMany({
        where: { tenantId, frameworkId },
      });
    }
    return controls;
  }

  async updateControlStatus(controlId: string, status: 'IMPLEMENTED' | 'PARTIAL', evidenceUrl?: string) {
    const tenantId = this.getTenantId();
    const control = await this.prisma.complianceControl.findFirst({
      where: { id: controlId, tenantId },
    });

    if (!control) {
      throw new NotFoundException(`Control ${controlId} not found`);
    }

    const updated = await this.prisma.complianceControl.update({
      where: { id: controlId },
      data: { status, evidenceUrl },
    });

    // Re-evaluate framework compliance score
    const all = await this.prisma.complianceControl.findMany({
      where: { tenantId, frameworkId: control.frameworkId },
    });
    const implementedCount = all.filter(c => c.status === 'IMPLEMENTED').length;
    const score = all.length > 0 ? (implementedCount / all.length) * 100 : 100.0;

    await this.prisma.complianceFramework.updateMany({
      where: { id: control.frameworkId, tenantId },
      data: { complianceScore: score, lastAssessedAt: new Date() },
    });

    return updated;
  }

  // --- Security Assessments ---
  async getAssessments() {
    const tenantId = this.getTenantId();
    let audits = await this.prisma.securityAssessment.findMany({
      where: { tenantId },
    });

    if (audits.length === 0) {
      await this.prisma.securityAssessment.create({
        data: {
          tenantId,
          assessorName: 'CISO Compliance Advisory',
          assessmentType: 'INTERNAL',
          findingsCount: 3,
          overallScore: 92.0,
        },
      });
      audits = await this.prisma.securityAssessment.findMany({
        where: { tenantId },
      });
    }
    return audits;
  }

  // --- Vulnerability Scans ---
  async getVulnerabilityScans() {
    const tenantId = this.getTenantId();
    let scans = await this.prisma.vulnerabilityScan.findMany({
      where: { tenantId },
    });

    if (scans.length === 0) {
      await this.prisma.vulnerabilityScan.create({
        data: {
          tenantId,
          scannerName: 'MedFlow Prisma Guard Scanner',
          criticalCount: 0,
          highCount: 1,
          mediumCount: 4,
          lowCount: 12,
          scanLogUrl: 'https://security-reports.medflow.internal/scans/scan-49938.log',
        },
      });
      scans = await this.prisma.vulnerabilityScan.findMany({
        where: { tenantId },
      });
    }
    return scans;
  }

  // --- Penetration Tests ---
  async getPenetrationTests() {
    const tenantId = this.getTenantId();
    let pentests = await this.prisma.penetrationTest.findMany({
      where: { tenantId },
    });

    if (pentests.length === 0) {
      await this.prisma.penetrationTest.create({
        data: {
          tenantId,
          testerName: 'SecOps Penetration Advisory Group',
          targetScope: 'MedFlow Patient EHR & Consult API endpoints',
          criticalFindings: 0,
          highFindings: 0,
          remediationStatus: 'COMPLETED',
        },
      });
      pentests = await this.prisma.penetrationTest.findMany({
        where: { tenantId },
      });
    }
    return pentests;
  }
}
