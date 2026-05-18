import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';

export interface WebhookEventDefinition {
  eventType: string;
  category: string;
  description: string;
  samplePayload: Record<string, unknown>;
}

@Injectable()
export class WebhookCatalogService {
  private readonly catalog: WebhookEventDefinition[] = [
    { eventType: 'patient.created', category: 'patients', description: 'New patient registered', samplePayload: { patientId: 'uuid', mrdNumber: 'MRD-123456' } },
    { eventType: 'appointment.booked', category: 'appointments', description: 'Appointment scheduled', samplePayload: { appointmentId: 'uuid', patientId: 'uuid' } },
    { eventType: 'appointment.created', category: 'appointments', description: 'Appointment created via API', samplePayload: { appointmentId: 'uuid' } },
    { eventType: 'appointment.cancelled', category: 'appointments', description: 'Appointment cancelled', samplePayload: { appointmentId: 'uuid' } },
    { eventType: 'prescription.generated', category: 'clinical', description: 'Prescription issued', samplePayload: { prescriptionId: 'uuid', patientId: 'uuid' } },
    { eventType: 'lab.result.ready', category: 'diagnostics', description: 'Lab result finalized', samplePayload: { orderId: 'uuid', patientId: 'uuid' } },
    { eventType: 'invoice.paid', category: 'billing', description: 'Invoice payment completed', samplePayload: { billId: 'uuid', amount: 0 } },
    { eventType: 'payment.completed', category: 'billing', description: 'Payment captured', samplePayload: { paymentId: 'uuid' } },
    { eventType: 'queue.updated', category: 'operations', description: 'Queue position changed', samplePayload: { queueEntryId: 'uuid' } },
    { eventType: 'telemedicine.started', category: 'telehealth', description: 'Telemedicine session started', samplePayload: { sessionId: 'uuid' } },
  ];

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('webhooks') private readonly webhooksQueue: Queue,
  ) {}

  getCatalog(): WebhookEventDefinition[] {
    return this.catalog;
  }

  validateEvents(events: string[]) {
    const valid = new Set(this.catalog.map((e) => e.eventType));
    const invalid = events.filter((e) => !valid.has(e));
    if (invalid.length > 0) {
      throw new BadRequestException(`Unknown webhook events: ${invalid.join(', ')}`);
    }
  }

  async listDeliveries(clientId: string, status?: string) {
    return this.prisma.apiWebhookDelivery.findMany({
      where: {
        subscription: { clientId },
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        subscription: { select: { url: true, events: true } },
      },
    });
  }

  async listDeadLetter(clientId: string) {
    return this.listDeliveries(clientId, 'DEAD');
  }

  async replayDelivery(deliveryId: string, clientId: string) {
    const delivery = await this.prisma.apiWebhookDelivery.findFirst({
      where: {
        id: deliveryId,
        subscription: { clientId },
      },
      include: { subscription: true },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    await this.prisma.apiWebhookDelivery.update({
      where: { id: deliveryId },
      data: { status: 'PENDING', retryCount: 0, errorReason: null },
    });

    await this.webhooksQueue.add(
      'webhook-delivery',
      {
        deliveryId: delivery.id,
        subscriptionId: delivery.subscriptionId,
        url: delivery.subscription.url,
        secret: delivery.subscription.secret,
        eventType: delivery.eventType,
        payload: delivery.payload,
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 10000 },
      },
    );

    return { replayed: true, deliveryId };
  }

  verifySignature(payload: string, secret: string, signature: string): boolean {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected, 'utf8'),
        Buffer.from(signature, 'utf8'),
      );
    } catch {
      return false;
    }
  }
}
