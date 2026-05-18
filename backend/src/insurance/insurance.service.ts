import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class PreAuthRequest {
  patientId: string;
  policyId: string;
  estimatedAmount: number;
  clinicalIndication: string;
  requestedBy?: string;
}

export class ClaimRequest {
  billId: string;
  copayAmount: number;
  claimedAmount: number;
  icdCode: string;
  notes?: string;
}

@Injectable()
export class InsuranceService {
  // Decentralized file-backed or memory persistence for Pre-Auths and Claims (as schema is stable)
  private preAuths: Map<string, any> = new Map();
  private claims: Map<string, any> = new Map();
  private tpaAuditLogs: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Request Cashless Pre-Authorization
   */
  async requestPreAuth(req: PreAuthRequest): Promise<any> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: req.patientId },
      include: { insurance: true },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${req.patientId} not found`);
    }

    const policy = patient.insurance.find((ins) => ins.id === req.policyId);
    if (!policy) {
      throw new NotFoundException(`Active insurance policy with ID ${req.policyId} not found for this patient`);
    }

    if (!policy.isActive) {
      throw new BadRequestException('Insurance policy is currently INACTIVE');
    }

    // Verify validity dates
    const now = new Date();
    if (policy.validFrom && now < policy.validFrom) {
      throw new BadRequestException(`Policy is not active yet. Starts on ${policy.validFrom.toISOString()}`);
    }
    if (policy.validTill && now > policy.validTill) {
      throw new BadRequestException(`Policy has expired on ${policy.validTill.toISOString()}`);
    }

    // Check remaining coverage
    const coverage = Number(policy.coverageAmount || 0);
    if (req.estimatedAmount > coverage) {
      throw new BadRequestException(`Requested pre-auth amount (${req.estimatedAmount}) exceeds total coverage (${coverage})`);
    }

    const preAuthId = `AUTH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const preAuth = {
      id: preAuthId,
      patientId: req.patientId,
      policyId: req.policyId,
      provider: policy.provider,
      policyNumber: policy.policyNumber,
      estimatedAmount: req.estimatedAmount,
      clinicalIndication: req.clinicalIndication,
      requestedBy: req.requestedBy,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.preAuths.set(preAuthId, preAuth);

    this.logTpaAudit(preAuthId, 'PRE_AUTH_REQUEST', req.requestedBy || 'SYSTEM', `Pre-auth of ${req.estimatedAmount} requested for ${policy.provider}`);

    return preAuth;
  }

  /**
   * TPA (Third-Party Administrator) Action: Review and Approve/Reject
   */
  async reviewPreAuth(preAuthId: string, action: 'APPROVE' | 'REJECT', reviewerId: string, remarks: string, approvedAmount?: number): Promise<any> {
    const preAuth = this.preAuths.get(preAuthId);
    if (!preAuth) {
      throw new NotFoundException(`Pre-auth request ${preAuthId} not found`);
    }

    if (preAuth.status !== 'PENDING') {
      throw new BadRequestException(`Pre-auth is already in ${preAuth.status} state`);
    }

    preAuth.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    preAuth.reviewedBy = reviewerId;
    preAuth.reviewedAt = new Date();
    preAuth.remarks = remarks;
    preAuth.approvedAmount = action === 'APPROVE' ? (approvedAmount ?? preAuth.estimatedAmount) : 0;

    this.preAuths.set(preAuthId, preAuth);

    this.logTpaAudit(preAuthId, `PRE_AUTH_${action}`, reviewerId, `Pre-auth status set to ${preAuth.status}. Remarks: ${remarks}`);

    return preAuth;
  }

  /**
   * Split Billing Calculator (Patient Co-Pay vs. Cashless Insurance Claim)
   */
  async calculateSplitBilling(billId: string, policyId: string): Promise<any> {
    const bill = await this.prisma.bill.findUnique({
      where: { id: billId },
      include: { patient: { include: { insurance: true } } },
    });

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${billId} not found`);
    }

    const policy = bill.patient.insurance.find((ins) => ins.id === policyId);
    if (!policy) {
      throw new NotFoundException(`Insurance policy with ID ${policyId} not found`);
    }

    const gross = Number(bill.grossAmount);
    const discount = Number(bill.discountTotal);
    const net = Number(bill.netAmount);

    // Dynamic Co-Pay rules (e.g., standard 15% co-pay, remaining 85% covered by TPA)
    const copayRate = 0.15;
    const copayAmount = parseFloat((net * copayRate).toFixed(2));
    const claimedAmount = parseFloat((net - copayAmount).toFixed(2));

    return {
      billId,
      billNumber: bill.billNumber,
      grossAmount: gross,
      discountTotal: discount,
      netAmount: net,
      policyId,
      provider: policy.provider,
      policyNumber: policy.policyNumber,
      coPayAmount: copayAmount,
      insuranceClaimAmount: claimedAmount,
      coPayPercentage: copayRate * 100,
    };
  }

  /**
   * Generate Claims File mapped from Clinical Cases and ICD Code
   */
  async generateClaim(req: ClaimRequest, actorId: string): Promise<any> {
    const bill = await this.prisma.bill.findUnique({
      where: { id: req.billId },
      include: {
        patient: { include: { insurance: true } },
        case: { include: { consultation: true } },
      },
    });

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${req.billId} not found`);
    }

    const consultation = bill.case?.consultation;
    const diagnosis = consultation?.finalDiagnosis || consultation?.provisionalDiagnosis || 'No active clinical diagnosis';

    const claimId = `CLM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const claim = {
      id: claimId,
      billId: req.billId,
      billNumber: bill.billNumber,
      patientId: bill.patientId,
      patientName: `${bill.patient.firstName} ${bill.patient.lastName}`,
      mrdNumber: bill.patient.mrdNumber,
      copayAmount: req.copayAmount,
      claimedAmount: req.claimedAmount,
      icdCode: req.icdCode,
      clinicalDiagnosis: diagnosis,
      status: 'SUBMITTED',
      notes: req.notes || '',
      generatedBy: actorId,
      createdAt: new Date(),
    };

    this.claims.set(claimId, claim);

    this.logTpaAudit(claimId, 'CLAIM_SUBMISSION', actorId, `Claim generated for Bill ${bill.billNumber} with ICD code ${req.icdCode}`);

    return claim;
  }

  /**
   * Get single claim info
   */
  async getClaim(claimId: string): Promise<any> {
    const claim = this.claims.get(claimId);
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${claimId} not found`);
    }
    return claim;
  }

  /**
   * List all claims for a patient
   */
  async getClaimsByPatient(patientId: string): Promise<any[]> {
    return Array.from(this.claims.values()).filter((c) => c.patientId === patientId);
  }

  /**
   * Fetch pre-auth status
   */
  async getPreAuth(preAuthId: string): Promise<any> {
    const preAuth = this.preAuths.get(preAuthId);
    if (!preAuth) {
      throw new NotFoundException(`Pre-auth with ID ${preAuthId} not found`);
    }
    return preAuth;
  }

  /**
   * Fetch all TPA audit logs
   */
  getTpaAuditLogs(): any[] {
    return this.tpaAuditLogs;
  }

  // --- Internal Logger Helper ---
  private logTpaAudit(resourceId: string, action: string, userId: string, details: string) {
    this.tpaAuditLogs.push({
      timestamp: new Date(),
      resourceId,
      action,
      userId,
      details,
    });
  }
}
