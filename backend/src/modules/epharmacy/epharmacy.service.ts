import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class EpharmacyService {
  constructor(private readonly prisma: PrismaService) {}

  async createPrescription(
    tenantId: string,
    doctorId: string,
    patientId: string,
    items: { drugName: string; dosage: string; frequency: string; duration: string; instructions?: string; rxNormCode?: string }[],
    options: { encounterId?: string; refillsAllowed?: number; isControlled?: boolean; validDays?: number } = {}
  ) {
    const signature = crypto
      .createHmac('sha256', process.env.PRESCRIPTION_SECRET || 'secret')
      .update(`${tenantId}:${doctorId}:${patientId}:${Date.now()}`)
      .digest('hex');

    const qrCode = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (options.validDays || 30));

    return this.prisma.digitalPrescription.create({
      data: {
        tenantId, doctorId, patientId,
        encounterId: options.encounterId,
        qrCode, signature,
        expiresAt,
        refillsAllowed: options.refillsAllowed ?? 0,
        isControlled: options.isControlled ?? false,
        items: {
          create: items.map(item => ({
            drugName: item.drugName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
            rxNormCode: item.rxNormCode,
            interactionFlags: {},
          })),
        },
      },
      include: { items: true },
    });
  }

  async verifyPrescription(qrCode: string) {
    const rx = await this.prisma.digitalPrescription.findFirst({
      where: { qrCode },
      include: { items: true },
    });

    if (!rx) return { valid: false, reason: 'Prescription not found' };
    if (rx.status === 'EXPIRED' || new Date() > rx.expiresAt)
      return { valid: false, reason: 'Prescription expired', prescription: rx };
    if (rx.status === 'CANCELLED')
      return { valid: false, reason: 'Prescription cancelled', prescription: rx };

    return { valid: true, prescription: rx };
  }

  async dispensePrescription(tenantId: string, qrCode: string, pharmacistId: string) {
    const rx = await this.prisma.digitalPrescription.findFirst({ where: { qrCode, tenantId } });
    if (!rx) throw new NotFoundException('Prescription not found');
    if (rx.status !== 'ACTIVE') throw new BadRequestException(`Cannot dispense: status is ${rx.status}`);

    return this.prisma.digitalPrescription.update({
      where: { id: rx.id },
      data: { status: 'DISPENSED', dispensedAt: new Date(), dispensedBy: pharmacistId },
    });
  }

  async requestRefill(tenantId: string, prescriptionId: string) {
    const rx = await this.prisma.digitalPrescription.findFirst({ where: { id: prescriptionId, tenantId } });
    if (!rx) throw new NotFoundException('Prescription not found');
    if (rx.refillsUsed >= rx.refillsAllowed) throw new BadRequestException('No refills remaining');

    return this.prisma.digitalPrescription.update({
      where: { id: rx.id },
      data: { refillsUsed: rx.refillsUsed + 1, status: 'ACTIVE', dispensedAt: null },
    });
  }

  async getPrescriptions(tenantId: string, patientId?: string) {
    return this.prisma.digitalPrescription.findMany({
      where: { tenantId, ...(patientId ? { patientId } : {}) },
      include: { items: true },
      orderBy: { issuedAt: 'desc' },
    });
  }
}
