import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './providers/stripe.service';
import { RazorpayService } from './providers/razorpay.service';
import { CreatePaymentIntentDto, PaymentProviderType } from './dto/payment.dto';
import { SmsWhatsappService } from '../communications/sms-whatsapp.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly razorpayService: RazorpayService,
    private readonly smsWhatsappService: SmsWhatsappService,
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

  async createPaymentLink(dto: CreatePaymentIntentDto, patientId: string) {
    if (dto.provider !== PaymentProviderType.RAZORPAY) {
      throw new BadRequestException('Payment links are only supported for Razorpay at this time');
    }

    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    const metadata = {
      patientId,
      billId: dto.billId,
      appointmentId: dto.appointmentId,
    };

    const paymentLinkResult = await this.razorpayService.createPaymentLink(dto.amount, dto.currency, metadata, {
      name: `${patient.firstName} ${patient.lastName}`,
      contact: patient.mobile || '',
      email: patient.email || ''
    });

    // Save intent in database using the payment link ID
    await this.prisma.paymentIntent.create({
      data: {
        provider: dto.provider,
        providerId: paymentLinkResult.id,
        amount: dto.amount,
        currency: dto.currency,
        patientId,
        billId: dto.billId,
        appointmentId: dto.appointmentId,
        status: 'PENDING',
      },
    });

    if (patient.mobile) {
      try {
        await this.smsWhatsappService.sendWhatsApp({
          recipient: patient.mobile,
          content: `Hi ${patient.firstName}, here is your payment link for Rs. ${dto.amount}: ${paymentLinkResult.short_url}`,
          patientId: patient.id,
        });
      } catch (err) {
        this.logger.error(`Failed to send WhatsApp link to ${patient.mobile}`, err);
      }
    }

    return {
      id: paymentLinkResult.id,
      shortUrl: paymentLinkResult.short_url,
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
      if (eventType === 'payment_intent.succeeded' || eventType === 'order.paid' || eventType === 'payment_link.paid') {
        let providerId = '';
        if (provider === 'STRIPE') {
          providerId = payload.data.object.id;
        } else if (eventType === 'payment_link.paid') {
          providerId = payload.payload.payment_link.entity.id;
        } else {
          providerId = payload.payload.payment.entity.order_id;
        }
        
        await this.prisma.paymentIntent.updateMany({
          where: { providerId },
          data: { status: 'SUCCEEDED' },
        });

        // Try to update the bill if we can find the intent
        const intents = await this.prisma.paymentIntent.findMany({
          where: { providerId }
        });

        if (intents.length > 0 && intents[0].billId) {
          try {
            await this.prisma.bill.update({
              where: { id: intents[0].billId },
              data: { paymentStatus: 'PAID', balanceAmount: 0 }
            });
            this.logger.log(`Marked Bill ${intents[0].billId} as PAID via Webhook`);
          } catch (e) {
            this.logger.error(`Could not update bill ${intents[0].billId}`, e);
          }
        }
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
