import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from './providers/stripe.service';
import { RazorpayService } from './providers/razorpay.service';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';

import { CommunicationsModule } from '../communications/communications.module';

@Module({
  imports: [CommunicationsModule],
  providers: [PaymentService, StripeService, RazorpayService],
  controllers: [PaymentController, WebhookController],
  exports: [PaymentService, RazorpayService],
})
export class PaymentModule {}
