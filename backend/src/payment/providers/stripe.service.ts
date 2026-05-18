import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, PaymentIntentResult } from '../interfaces/payment-provider.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements PaymentProvider {
  private stripe: any;
  private readonly logger = new Logger(StripeService.name);

  constructor(private configService: ConfigService) {
    const secret = this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
    this.stripe = new Stripe(secret, {} as any);
  }

  async createIntent(amount: number, currency: string, metadata: any): Promise<PaymentIntentResult> {
    this.logger.log(`Creating Stripe PaymentIntent for amount ${amount} ${currency}`);
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: currency.toLowerCase(),
      metadata,
    });

    return {
      clientSecret: paymentIntent.client_secret || '',
      providerId: paymentIntent.id,
    };
  }

  verifyWebhookSignature(payload: string | Buffer, signature: string): boolean {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || 'whsec_placeholder';
    try {
      this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return true;
    } catch (err: any) {
      this.logger.error(`Stripe Webhook Error: ${err.message}`);
      return false;
    }
  }
}
