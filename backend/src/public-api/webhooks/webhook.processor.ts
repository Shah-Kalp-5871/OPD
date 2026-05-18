import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { TelemetryService } from '../../metrics/telemetry.service';
import * as crypto from 'crypto';

@Processor('webhooks')
@Injectable()
export class WebhookProcessor extends WorkerHost {
  private readonly logger = new Logger('WebhookProcessor');

  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetryService: TelemetryService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { deliveryId, subscriptionId, url, secret, eventType, payload } = job.data;
    const startTime = Date.now();

    this.logger.log(`Processing webhook delivery job ${job.id} for subscription ${subscriptionId}`);

    const payloadString = JSON.stringify(payload);
    
    // 1. Calculate HMAC-SHA256 signature
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    let responseStatus: number | null = null;
    let responseBody = '';
    let status: 'DELIVERED' | 'FAILED' | 'RETRYING' | 'DEAD' = 'FAILED';
    let errorReason: string | null = null;

    try {
      // 2. Perform the HTTP POST request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MedFlow-Webhook-Dispatcher/2.0',
          'X-MedFlow-Signature': signature,
          'X-MedFlow-Event': eventType,
        },
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      responseStatus = response.status;
      responseBody = await response.text();

      // Limit response body size stored in DB to avoid overflow
      if (responseBody.length > 5000) {
        responseBody = responseBody.substring(0, 5000) + '... [TRUNCATED]';
      }

      if (response.ok) {
        status = 'DELIVERED';
        this.logger.log(`Webhook successfully delivered to ${url} for subscription ${subscriptionId}`);
      } else {
        errorReason = `HTTP Error Status: ${response.status}`;
        this.logger.warn(`Webhook delivery returned status ${response.status} for ${url}`);
      }
    } catch (error: any) {
      errorReason = error.name === 'AbortError' ? 'Request Timeout (10s)' : error.message;
      this.logger.error(`Webhook connection to ${url} failed: ${errorReason}`);
    }

    const duration = Date.now() - startTime;
    const retryCount = job.attemptsMade;

    // 3. Update status to DEAD if max attempts are exhausted, or RETRYING if it failed
    if (status !== 'DELIVERED') {
      if (retryCount >= 4) { // 5th attempt (0-indexed 4)
        status = 'DEAD';
      } else {
        status = 'RETRYING';
      }
    }

    // 4. Update the delivery log in the database
    await this.prisma.apiWebhookDelivery.update({
      where: { id: deliveryId },
      data: {
        responseStatus,
        responseBody: responseBody || undefined,
        retryCount: retryCount + 1,
        status,
        errorReason,
      },
    });

    // 5. Update Telemetry metrics
    this.telemetryService.recordWebhookDuration('public_api', duration);
    if (status === 'DELIVERED') {
      this.telemetryService.incrementWebhookJobs('public_api', eventType);
    } else {
      this.telemetryService.incrementWebhookFailures('public_api');
    }

    // 6. Throw error to trigger BullMQ retry logic if not completed or dead
    if (status === 'RETRYING') {
      throw new Error(`Webhook delivery failed to ${url}. Reason: ${errorReason}. Retrying...`);
    }

    return { status, responseStatus };
  }
}
