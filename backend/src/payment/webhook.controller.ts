import { Controller, Post, Headers, Req, Res, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from './providers/stripe.service';
import { RazorpayService } from './providers/razorpay.service';
import * as express from 'express';

@Controller('api/v2/webhooks')
export class WebhookController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
    private readonly razorpayService: RazorpayService,
  ) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: express.Request,
    @Res() res: express.Response,
    @Headers('stripe-signature') signature: string,
  ) {
    // Note: To verify Stripe webhooks properly, we need the raw body.
    // Ensure that main.ts is configured to provide raw body on this route.
    const payload = (req as any).rawBody || req.body;
    
    if (!this.stripeService.verifyWebhookSignature(payload, signature)) {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    const event = req.body;
    await this.paymentService.processWebhookEvent('STRIPE', event.id, event.type, event);

    res.status(200).send();
  }

  @Post('razorpay')
  async handleRazorpayWebhook(
    @Req() req: express.Request,
    @Res() res: express.Response,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    // Razorpay webhook validation requires stringified raw body
    const payload = JSON.stringify(req.body);
    
    if (!this.razorpayService.verifyWebhookSignature(payload, signature)) {
      throw new BadRequestException('Invalid Razorpay webhook signature');
    }

    const event = req.body;
    // Razorpay events have account_id or event structure to use as idempotency key
    const eventId = req.headers['x-razorpay-event-id'] as string || event.account_id + '_' + Date.now();
    
    await this.paymentService.processWebhookEvent('RAZORPAY', eventId, event.event, event);

    res.status(200).send();
  }
}
