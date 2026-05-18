import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface WebhookRegistrationDto {
  url: string;
  name: string;
  providerType: 'THYROCARE' | 'REDCLIFFE' | 'METROPOLIS' | 'GENERIC';
  secret: string;
  allowedIps?: string[];
}

@Injectable()
export class ExternalLabsService {
  private readonly logger = new Logger(ExternalLabsService.name);

  // In-memory/in-db registry for external webhook target routes (outbound)
  private outboundRegistrations: Array<{
    id: string;
    name: string;
    url: string;
    providerType: string;
    secret: string;
    allowedIps?: string[];
  }> = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new outbound webhook target for order notifications.
   */
  async registerOutboundWebhook(dto: WebhookRegistrationDto) {
    const registration = {
      id: Math.random().toString(36).substring(2, 15),
      ...dto,
    };
    this.outboundRegistrations.push(registration);
    this.logger.log(`Registered outbound webhook target: [${dto.name}] -> ${dto.url}`);
    return registration;
  }

  /**
   * Get all registered webhook targets.
   */
  getRegistrations() {
    return this.outboundRegistrations;
  }

  /**
   * Validates the inbound payload signature using HMAC-SHA256.
   */
  validateInboundSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    const computedSig = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSig));
  }

  /**
   * Processes inbound webhook requests from specific lab providers.
   */
  async processInboundResult(
    provider: string,
    payload: any,
    signature: string,
    secret: string,
  ): Promise<any> {
    const rawPayload = JSON.stringify(payload);
    
    // Webhook Signature verification
    if (signature && secret) {
      const isValid = this.validateInboundSignature(rawPayload, signature, secret);
      if (!isValid) {
        throw new BadRequestException('Cryptographic webhook signature verification failed.');
      }
    }

    this.logger.log(`Processing inbound webhook from [${provider}]`);

    // Parse order status and reports according to provider adapter mapping
    let orderId = '';
    let status = '';
    let reportUrl = '';
    const results: any[] = [];

    switch (provider.toUpperCase()) {
      case 'THYROCARE':
        // Thyrocare adapter mapping
        orderId = payload.thyro_order_id || '';
        status = payload.status === 'COMPLETED' ? 'RESULT_READY' : 'PROCESSING';
        reportUrl = payload.pdf_report_download_link || '';
        if (payload.tests && Array.isArray(payload.tests)) {
          payload.tests.forEach((t: any) => {
            results.push({
              parameterId: t.code,
              numericValue: parseFloat(t.value),
              textValue: t.value?.toString(),
              isAbnormal: t.abnormal === 'YES',
              notes: t.reference_range,
            });
          });
        }
        break;

      case 'REDCLIFFE':
        // Redcliffe adapter mapping
        orderId = payload.redcliffe_order_id || '';
        status = payload.order_status === 'RESULT_UPLOADED' ? 'RESULT_READY' : 'PROCESSING';
        reportUrl = payload.report_file_url || '';
        break;

      case 'METROPOLIS':
        // Metropolis adapter mapping
        orderId = payload.metropolis_ref || '';
        status = payload.stage === 'RELEASED' ? 'RESULT_READY' : 'PROCESSING';
        reportUrl = payload.pdf_url || '';
        break;

      default:
        // Generic Webhook adapter
        orderId = payload.orderId || '';
        status = payload.status || 'RESULT_READY';
        reportUrl = payload.reportUrl || '';
    }

    if (!orderId) {
      throw new BadRequestException('Order ID is missing in payload structure.');
    }

    // Synchronize status with database investigation order
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.investigationOrder.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Investigation Order with ID ${orderId} not found`);
      }

      // Update status
      const updatedOrder = await tx.investigationOrder.update({
        where: { id: orderId },
        data: {
          status: status as any,
          notes: `${order.notes || ''}\n[Webhook Result Ingestion from ${provider}]: Status updated to ${status}. Report: ${reportUrl}`,
        },
      });

      // Save attachment file if present
      if (reportUrl) {
        await tx.investigationFile.create({
          data: {
            orderId,
            fileUrl: reportUrl,
            fileName: `${provider.toLowerCase()}_report_${orderId}.pdf`,
            uploadedById: order.doctorId,
            branchId: order.branchId,
            uploadedAt: new Date(),
          },
        });
      }

      // Inject individual result values if present (e.g. Thyrocare detailed metrics)
      for (const res of results) {
        await tx.investigationResult.create({
          data: {
            orderId,
            parameterId: res.parameterId,
            numericValue: res.numericValue,
            textValue: res.textValue,
            isAbnormal: res.isAbnormal,
            notes: res.notes,
            enteredById: order.doctorId,
            branchId: order.branchId,
          },
        });
      }

      // Log to HIPAA Audit Trail
      await tx.hipaaAuditLog.create({
        data: {
          actionType: 'LAB_WEBHOOK_INGESTION',
          module: 'LABORATORY',
          branchId: order.branchId,
          details: `Processed lab reports from ${provider} for Order ${orderId}. Status: ${status}`,
        },
      });

      return updatedOrder;
    });
  }

  /**
   * Outbound notification retry handler: sends order announcements to external providers.
   */
  async notifyExternalPartner(registrationId: string, payload: any): Promise<any> {
    const reg = this.outboundRegistrations.find((r) => r.id === registrationId);
    if (!reg) throw new NotFoundException('Outbound webhook registration not found.');

    const body = JSON.stringify(payload);
    
    // Generate HMAC-SHA256 signature
    const signature = crypto
      .createHmac('sha256', reg.secret)
      .update(body)
      .digest('hex');

    const maxRetries = 3;
    let attempt = 1;
    let success = false;
    let lastError = '';

    while (attempt <= maxRetries && !success) {
      try {
        const response = await fetch(reg.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-MedFlow-Signature': signature,
            'X-MedFlow-Timestamp': Date.now().toString(),
          },
          body,
        });

        if (response.ok) {
          success = true;
          this.logger.log(`Successfully dispatched outbound webhook event to ${reg.url}`);
        } else {
          lastError = `Status: ${response.status}`;
          attempt++;
          if (attempt <= maxRetries) {
            await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 1000));
          }
        }
      } catch (err: any) {
        lastError = err.message;
        attempt++;
        if (attempt <= maxRetries) {
          await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 1000));
        }
      }
    }

    if (!success) {
      this.logger.error(`Outbound webhook failed to dispatch to ${reg.url} after ${maxRetries} attempts.`);
      
      // Save failure trace to database HIPAA Logs for recovery dashboard
      await this.prisma.hipaaAuditLog.create({
        data: {
          actionType: 'OUTBOUND_WEBHOOK_FAILED',
          module: 'COMMUNICATION',
          details: `Outbound lab order notification failed to ${reg.url} (Error: ${lastError})`,
        },
      });
      
      return { success: false, error: lastError };
    }

    return { success: true };
  }
}
