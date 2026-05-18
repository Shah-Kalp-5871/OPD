import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './providers/stripe.service';
import { RazorpayService } from './providers/razorpay.service';
import { CreatePaymentIntentDto, PaymentProviderType } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly razorpayService: RazorpayService,
  ) {}

  async createIntent(dto: CreatePaymentIntentDto, patientId: string) {
    const providerService = dto.provider === PaymentProviderType.STRIPE 
      ? this.stripeService 
      : this.razorpayService;

    const metadata = {
      patientId,
      billId: dto.billId,
      appointmentId: dto.appointmentId,
    };

    const intent = await providerService.createIntent(dto.amount, dto.currency, metadata);

    // Save intent in database
    await this.prisma.paymentIntent.create({
      data: {
        provider: dto.provider,
        providerId: intent.providerId,
        amount: dto.amount,
        currency: dto.currency,
        patientId,
        billId: dto.billId,
        appointmentId: dto.appointmentId,
      },
    });

    return {
      clientSecret: intent.clientSecret,
      providerId: intent.providerId,
    };
  }

  async processWebhookEvent(provider: string, eventId: string, eventType: string, payload: any) {
    // Idempotency check
    const existingEvent = await this.prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      this.logger.log(`Webhook event ${eventId} already processed.`);
      return;
    }

    try {
      // Logic to fulfill order
      if (eventType === 'payment_intent.succeeded' || eventType === 'order.paid') {
        const providerId = provider === 'STRIPE' ? payload.data.object.id : payload.payload.payment.entity.order_id;
        
        await this.prisma.paymentIntent.update({
          where: { providerId },
          data: { status: 'SUCCEEDED' },
        });

        // In a full implementation, you would also update the Bill or Appointment status here
      }

      await this.prisma.webhookEvent.create({
        data: {
          provider,
          eventId,
          eventType,
          payload: payload as any,
          status: 'PROCESSED',
        },
      });
      this.logger.log(`Successfully processed webhook event ${eventId}`);
    } catch (error: any) {
      this.logger.error(`Failed to process webhook event ${eventId}: ${error.message}`);
      await this.prisma.webhookEvent.create({
        data: {
          provider,
          eventId,
          eventType,
          payload: payload as any,
          status: 'FAILED',
          error: error.message,
        },
      });
    }
  }
}
