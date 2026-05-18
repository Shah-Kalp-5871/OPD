import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, PaymentIntentResult } from '../interfaces/payment-provider.interface';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService implements PaymentProvider {
  private razorpay: any;
  private readonly logger = new Logger(RazorpayService.name);
  private webhookSecret: string;

  constructor(private configService: ConfigService) {
    const key_id = this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_placeholder';
    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'secret_placeholder';
    this.webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || 'webhook_secret';
    
    this.razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }

  async createIntent(amount: number, currency: string, metadata: any): Promise<PaymentIntentResult> {
    this.logger.log(`Creating Razorpay Order for amount ${amount} ${currency}`);
    const order = await this.razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects amounts in paise
      currency: currency.toUpperCase(),
      notes: metadata,
    });

    return {
      clientSecret: order.id, // For Razorpay, the order ID acts as the client secret
      providerId: order.id,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');

      return expectedSignature === signature;
    } catch (err: any) {
      this.logger.error(`Razorpay Webhook Error: ${err.message}`);
      return false;
    }
  }
}
