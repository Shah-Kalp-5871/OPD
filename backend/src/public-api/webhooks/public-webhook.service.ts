import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';
import { WebhookCatalogService } from './webhook-catalog.service';

@Injectable()
export class PublicWebhookService {
  private readonly logger = new Logger('PublicWebhookService');

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('webhooks') private readonly webhooksQueue: Queue,
    private readonly catalog: WebhookCatalogService,
  ) {}

  /**
   * Registers a new webhook subscription for a client.
   */
  async createSubscription(params: {
    clientId: string;
    url: string;
    events: string[];
  }) {
    this.catalog.validateEvents(params.events);

    const signingSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

    return this.prisma.apiWebhookSubscription.create({
      data: {
        clientId: params.clientId,
        url: params.url,
        secret: signingSecret,
        events: params.events,
        isActive: true,
      },
    });
  }

  /**
   * Lists all active webhook subscriptions for a client.
   */
  async listSubscriptions(clientId: string) {
    return this.prisma.apiWebhookSubscription.findMany({
      where: { clientId },
    });
  }

  /**
   * Deletes a webhook subscription.
   */
  async deleteSubscription(id: string, clientId: string) {
    const sub = await this.prisma.apiWebhookSubscription.findFirst({
      where: { id, clientId },
    });

    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.apiWebhookSubscription.delete({
      where: { id },
    });
  }

  /**
   * Triggers an outbound webhook event.
   * Finds matching subscriptions and pushes delivery jobs onto the BullMQ 'webhooks' queue.
   */
  async triggerWebhook(eventType: string, payload: any, branchId?: string) {
    // 1. Fetch matching active subscriptions
    const query: any = {
      isActive: true,
      events: {
        has: eventType,
      },
    };

    // If branch isolation (tenantId) applies, filter subscriptions by matching branch scope
    if (branchId) {
      query.client = {
        isActive: true,
        OR: [
          { tenantId: branchId },
          { tenantId: null } // Global or unrestricted partner
        ]
      };
    } else {
      query.client = {
        isActive: true
      };
    }

    const subscriptions = await this.prisma.apiWebhookSubscription.findMany({
      where: query,
      include: {
        client: true,
      },
    });

    this.logger.log(`Found ${subscriptions.length} subscribers for event ${eventType}`);

    const eventId = `evt_${crypto.randomBytes(12).toString('hex')}`;

    for (const sub of subscriptions) {
      // 2. Create the delivery record in PENDING status
      const delivery = await this.prisma.apiWebhookDelivery.create({
        data: {
          subscriptionId: sub.id,
          eventId,
          eventType,
          payload: payload || {},
          status: 'PENDING',
          retryCount: 0,
        },
      });

      // 3. Dispatch the job onto BullMQ with exponential backoff configurations
      await this.webhooksQueue.add(
        'webhook-delivery',
        {
          deliveryId: delivery.id,
          subscriptionId: sub.id,
          url: sub.url,
          secret: sub.secret,
          eventType,
          payload,
        },
        {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 10000, // 10 seconds starting delay
          },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );
    }
  }
}
