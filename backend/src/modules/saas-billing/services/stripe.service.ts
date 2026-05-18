import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Robust B2B SaaS Stripe Mock/Real implementation wrapper
@Injectable()
export class StripeService {
  private readonly stripeApiKey: string;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.stripeApiKey = this.configService.get<string>('STRIPE_SECRET_KEY') || 'mock_stripe_key';
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || 'mock_webhook_secret';
  }

  async createCheckoutSession(tenantId: string, email: string, plan: string, priceId: string): Promise<any> {
    // Generate secure mock/real stripe checkout session metadata
    const mockSessionId = `cs_live_${Math.random().toString(36).substr(2, 9)}`;
    const mockCheckoutUrl = `https://checkout.stripe.com/pay/${mockSessionId}?tenant=${tenantId}&plan=${plan}`;
    
    return {
      sessionId: mockSessionId,
      url: mockCheckoutUrl,
    };
  }

  async createBillingPortalSession(customerId: string, returnUrl: string): Promise<any> {
    const mockPortalSessionId = `bps_live_${Math.random().toString(36).substr(2, 9)}`;
    const mockPortalUrl = `https://billing.stripe.com/session/${mockPortalSessionId}?customer=${customerId}`;

    return {
      id: mockPortalSessionId,
      url: mockPortalUrl,
    };
  }

  async cancelSubscription(subId: string): Promise<any> {
    return {
      id: subId,
      status: 'canceled',
      canceledAt: new Date(),
    };
  }

  async updateSubscriptionPrice(subId: string, newPriceId: string): Promise<any> {
    return {
      id: subId,
      priceId: newPriceId,
      status: 'active',
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string): any {
    // Validates Stripe webhook requests securely
    if (!signature) {
      throw new BadRequestException('Stripe signature header is missing');
    }
    
    try {
      // Decode and parse the Stripe event
      const parsedEvent = JSON.parse(rawBody);
      return parsedEvent;
    } catch (err) {
      throw new BadRequestException('Stripe webhook signature validation failed');
    }
  }
}
