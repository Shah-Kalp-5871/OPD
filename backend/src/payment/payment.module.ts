import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from './providers/stripe.service';
import { RazorpayService } from './providers/razorpay.service';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';

@Module({
  providers: [PaymentService, StripeService, RazorpayService],
  controllers: [PaymentController, WebhookController],
  exports: [PaymentService],
})
export class PaymentModule {}
