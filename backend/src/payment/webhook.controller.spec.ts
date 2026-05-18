import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { PaymentService } from './payment.service';
import { StripeService } from './providers/stripe.service';
import { RazorpayService } from './providers/razorpay.service';
import { BadRequestException } from '@nestjs/common';
import * as express from 'express';

describe('WebhookController Integration & Signature Abuse Tests', () => {
  let controller: WebhookController;
  let paymentServiceMock: any;
  let stripeServiceMock: any;
  let razorpayServiceMock: any;

  beforeEach(async () => {
    paymentServiceMock = {
      processWebhookEvent: jest.fn().mockResolvedValue(true),
    };

    stripeServiceMock = {
      verifyWebhookSignature: jest.fn(),
    };

    razorpayServiceMock = {
      verifyWebhookSignature: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        { provide: PaymentService, useValue: paymentServiceMock },
        { provide: StripeService, useValue: stripeServiceMock },
        { provide: RazorpayService, useValue: razorpayServiceMock },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
  });

  describe('Stripe Webhook Resiliency', () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
      mockReq = {
        body: { id: 'evt_stripe_123', type: 'payment_intent.succeeded' },
        rawBody: Buffer.from(JSON.stringify({ id: 'evt_stripe_123' })),
      } as any;

      mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
    });

    it('should process webhook when signature is completely valid', async () => {
      stripeServiceMock.verifyWebhookSignature.mockReturnValue(true);

      await controller.handleStripeWebhook(mockReq as express.Request, mockRes as express.Response, 'valid_sig');

      expect(stripeServiceMock.verifyWebhookSignature).toHaveBeenCalledWith(mockReq.rawBody, 'valid_sig');
      expect(paymentServiceMock.processWebhookEvent).toHaveBeenCalledWith(
        'STRIPE',
        'evt_stripe_123',
        'payment_intent.succeeded',
        mockReq.body,
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should reject forged/invalid Stripe signature immediately', async () => {
      stripeServiceMock.verifyWebhookSignature.mockReturnValue(false);

      await expect(
        controller.handleStripeWebhook(mockReq as express.Request, mockRes as express.Response, 'forged_sig'),
      ).rejects.toThrow(BadRequestException);

      expect(paymentServiceMock.processWebhookEvent).not.toHaveBeenCalled();
    });
  });

  describe('Razorpay Webhook Resiliency', () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
      mockReq = {
        body: { event: 'payment.captured', account_id: 'acc_1' },
        headers: { 'x-razorpay-event-id': 'evt_razorpay_999' },
      } as any;

      mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
    });

    it('should process Razorpay webhook when signature is valid', async () => {
      razorpayServiceMock.verifyWebhookSignature.mockReturnValue(true);

      await controller.handleRazorpayWebhook(
        mockReq as express.Request,
        mockRes as express.Response,
        'valid_razorpay_sig',
      );

      expect(razorpayServiceMock.verifyWebhookSignature).toHaveBeenCalled();
      expect(paymentServiceMock.processWebhookEvent).toHaveBeenCalledWith(
        'RAZORPAY',
        'evt_razorpay_999',
        'payment.captured',
        mockReq.body,
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should reject invalid Razorpay signature', async () => {
      razorpayServiceMock.verifyWebhookSignature.mockReturnValue(false);

      await expect(
        controller.handleRazorpayWebhook(
          mockReq as express.Request,
          mockRes as express.Response,
          'invalid_razorpay_sig',
        ),
      ).rejects.toThrow(BadRequestException);

      expect(paymentServiceMock.processWebhookEvent).not.toHaveBeenCalled();
    });
  });
});
