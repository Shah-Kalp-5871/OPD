import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StripeService } from './stripe.service';
import { RedisCacheService } from '../../../common/cache/redis-cache.service';
import { TenantAuditService } from '../../tenancy/services/tenant-audit.service';

@Injectable()
export class SaasBillingService {
  private readonly logger = new Logger(SaasBillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly redis: RedisCacheService,
    private readonly auditService: TenantAuditService,
  ) {}

  async initiateCheckout(tenantId: string, userId: string, plan: string, priceId: string): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { subscription: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const adminEmail = tenant.slug + '@clinic.medflow.com'; // Default resolved email representation

    const session = await this.stripeService.createCheckoutSession(tenantId, adminEmail, plan, priceId);

    await this.auditService.log({
      tenantId,
      userId,
      action: 'BILLING_CHECKOUT_INITIATED',
      details: { plan, priceId, sessionId: session.sessionId },
    });

    return session;
  }

  async getBillingPortalUrl(tenantId: string, userId: string, returnUrl: string): Promise<string> {
    const sub = await this.prisma.tenantSubscription.findUnique({
      where: { tenantId },
    });

    if (!sub || !sub.customerId) {
      throw new BadRequestException('No billing history or Stripe customer associated with this tenant');
    }

    const session = await this.stripeService.createBillingPortalSession(sub.customerId, returnUrl);

    await this.auditService.log({
      tenantId,
      userId,
      action: 'BILLING_PORTAL_ACCESSED',
      details: { customerId: sub.customerId },
    });

    return session.url;
  }

  async logFeatureUsage(tenantId: string, userId: string | null, featureKey: string, cost = 1): Promise<void> {
    // 1. Audit log write
    await this.prisma.featureUsageLog.create({
      data: {
        tenantId,
        userId,
        featureKey,
        actionCost: cost,
      },
    });

    // 2. Increment cumulative metric usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const resetDate = new Date(startOfMonth);
    resetDate.setMonth(resetDate.getMonth() + 1);

    await this.prisma.subscriptionUsage.upsert({
      where: {
        tenantId_metricName: {
          tenantId,
          metricName: featureKey,
        },
      },
      update: {
        currentUsage: { increment: cost },
      },
      create: {
        tenantId,
        metricName: featureKey,
        currentUsage: cost,
        limitMax: this.getFeatureLimit(featureKey),
        resetAt: resetDate,
      },
    });
  }

  private getFeatureLimit(featureKey: string): number {
    switch (featureKey) {
      case 'TELEMEDICINE': return 500; // minutes per month
      case 'AI_ANALYSIS': return 100;  // inferences per month
      default: return 1000;
    }
  }

  async verifySeatAvailability(tenantId: string): Promise<boolean> {
    const sub = await this.prisma.tenantSubscription.findUnique({
      where: { tenantId },
    });

    if (!sub) return true; // trial default sandbox limits

    const activeUsersCount = await this.prisma.tenantUser.count({
      where: { tenantId },
    });

    if (activeUsersCount >= sub.seatsCount) {
      this.logger.warn(`Tenant ${tenantId} has reached maximum seat limit of ${sub.seatsCount}`);
      return false;
    }

    return true;
  }

  async handleStripeWebhook(event: any): Promise<void> {
    const eventType = event.type;
    const data = event.data?.object;

    this.logger.log(`Processing Stripe Webhook event: ${eventType}`);

    switch (eventType) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const tenantId = data.metadata?.tenantId;
        if (!tenantId) {
          this.logger.warn('Skipping subscription sync: tenantId missing from Stripe metadata');
          break;
        }

        const stripeStatus = data.status; // active, past_due, canceled, unpaid
        const plan = data.metadata?.plan || 'GROWTH';
        const priceId = data.items?.data[0]?.price?.id;
        const seatsCount = parseInt(data.metadata?.seatsCount || '5', 10);
        const trialEnd = data.trial_end ? new Date(data.trial_end * 1000) : null;
        const periodEnd = data.current_period_end ? new Date(data.current_period_end * 1000) : null;

        // Sync subscription status
        const updatedSub = await this.prisma.tenantSubscription.upsert({
          where: { tenantId },
          update: {
            plan,
            status: this.mapStripeStatusToTenant(stripeStatus),
            priceId,
            customerId: data.customer,
            subId: data.id,
            seatsCount,
            trialEndsAt: trialEnd,
            endsAt: periodEnd,
          },
          create: {
            tenantId,
            plan,
            status: this.mapStripeStatusToTenant(stripeStatus),
            priceId,
            customerId: data.customer,
            subId: data.id,
            seatsCount,
            trialEndsAt: trialEnd,
            endsAt: periodEnd,
          },
        });

        // Automatically disable tenant account if payment fails and status becomes suspended/unpaid
        if (updatedSub.status === 'UNPAID') {
          await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { isActive: false },
          });
          this.logger.warn(`Tenant ${tenantId} suspended due to payment failures.`);
        } else {
          await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { isActive: true },
          });
        }

        // Invalidate redis cache layers
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (tenant) {
          await this.redis.del(`tenant:id:${tenant.id}`);
          await this.redis.del(`tenant:slug:${tenant.slug}`);
        }

        await this.auditService.log({
          tenantId,
          userId: undefined,
          action: 'BILLING_SUBSCRIPTION_SYNCED',
          details: { subId: data.id, stripeStatus, plan },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const tenantId = data.metadata?.tenantId;
        if (tenantId) {
          await this.prisma.tenantSubscription.update({
            where: { tenantId },
            data: { status: 'CANCELED' },
          });
          
          // Disable tenant on hard cancellation
          await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { isActive: false },
          });

          const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
          if (tenant) {
            await this.redis.del(`tenant:id:${tenant.id}`);
            await this.redis.del(`tenant:slug:${tenant.slug}`);
          }

          await this.auditService.log({
            tenantId,
            userId: undefined,
            action: 'BILLING_SUBSCRIPTION_CANCELED',
            details: { subId: data.id },
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const tenantId = data.subscription_details?.metadata?.tenantId || data.metadata?.tenantId;
        if (!tenantId) break;

        const amountPaid = data.amount_paid ? data.amount_paid / 100 : 0;
        const amountDue = data.amount_due ? data.amount_due / 100 : 0;

        // Record Invoice
        const invoice = await this.prisma.billingInvoice.upsert({
          where: { stripeInvoiceId: data.id },
          update: {
            status: 'PAID',
            amountPaid,
            paidAt: new Date(),
          },
          create: {
            tenantId,
            stripeInvoiceId: data.id,
            invoiceNumber: data.number || `INV-${Date.now()}`,
            amountDue,
            amountPaid,
            currency: data.currency?.toUpperCase() || 'USD',
            status: 'PAID',
            hostedUrl: data.hosted_invoice_url,
            pdfUrl: data.invoice_pdf,
            dueDate: data.due_date ? new Date(data.due_date * 1000) : null,
            paidAt: new Date(),
            periodStart: new Date(data.period_start * 1000),
            periodEnd: new Date(data.period_end * 1000),
          },
        });

        // Record Transaction success ledger
        await this.prisma.billingTransaction.create({
          data: {
            tenantId,
            invoiceId: invoice.id,
            stripePaymentId: data.payment_intent,
            amount: amountPaid,
            currency: data.currency?.toUpperCase() || 'USD',
            status: 'SUCCESS',
            paymentMethod: 'STRIPE_CARD',
          },
        });

        await this.auditService.log({
          tenantId,
          userId: undefined,
          action: 'BILLING_INVOICE_PAID',
          details: { invoiceId: invoice.id, amountPaid },
        });
        break;
      }

      case 'invoice.payment_failed': {
        const tenantId = data.subscription_details?.metadata?.tenantId || data.metadata?.tenantId;
        if (!tenantId) break;

        const amountDue = data.amount_due ? data.amount_due / 100 : 0;

        // Record failed invoice
        const invoice = await this.prisma.billingInvoice.upsert({
          where: { stripeInvoiceId: data.id },
          update: {
            status: 'OPEN',
          },
          create: {
            tenantId,
            stripeInvoiceId: data.id,
            invoiceNumber: data.number || `INV-${Date.now()}`,
            amountDue,
            amountPaid: 0,
            currency: data.currency?.toUpperCase() || 'USD',
            status: 'OPEN',
            hostedUrl: data.hosted_invoice_url,
            pdfUrl: data.invoice_pdf,
            dueDate: data.due_date ? new Date(data.due_date * 1000) : null,
            periodStart: new Date(data.period_start * 1000),
            periodEnd: new Date(data.period_end * 1000),
          },
        });

        // Record transaction failure details
        await this.prisma.billingTransaction.create({
          data: {
            tenantId,
            invoiceId: invoice.id,
            stripePaymentId: data.payment_intent || `failed_${Date.now()}`,
            amount: amountDue,
            currency: data.currency?.toUpperCase() || 'USD',
            status: 'FAILED',
            errorMessage: data.billing_reason || 'Stripe automatic payment retry failed.',
          },
        });

        await this.auditService.log({
          tenantId,
          userId: undefined,
          action: 'BILLING_INVOICE_FAILED',
          details: { invoiceId: invoice.id, amountDue },
        });
        break;
      }
    }
  }

  private mapStripeStatusToTenant(stripeStatus: string): string {
    switch (stripeStatus) {
      case 'active':
      case 'trialing':
        return 'ACTIVE';
      case 'past_due':
        return 'PAST_DUE';
      case 'canceled':
        return 'CANCELED';
      case 'unpaid':
      case 'incomplete':
      case 'incomplete_expired':
        return 'UNPAID';
      default:
        return 'ACTIVE';
    }
  }
}
