import { Test, TestingModule } from '@nestjs/testing';
import { TelemedicineGateway } from './telemedicine.gateway';
import { TelemedicineAuthorizationService } from './services/telemedicine-authorization.service';
import { RoomStateService } from './redis/room-state.service';
import { TelemetryService } from '../metrics/telemetry.service';
import { WsJwtStrategy } from './auth/ws-jwt.strategy';
import { WsJwtGuard } from './auth/guards/ws-jwt.guard';
import { Socket } from 'socket.io';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { StripeService } from '../payment/providers/stripe.service';
import { RazorpayService } from '../payment/providers/razorpay.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MedFlow Security Abuse & Penetration Testing Simulations', () => {
  let gateway: TelemedicineGateway;
  let authServiceMock: any;
  let roomStateServiceMock: any;
  let telemetryServiceMock: any;
  let wsJwtStrategyMock: any;
  let paymentService: PaymentService;
  let prismaMock: any;

  beforeEach(async () => {
    authServiceMock = {
      authorizeRoomAccess: jest.fn(),
    };

    roomStateServiceMock = {
      getSocketMapping: jest.fn(),
      removeParticipant: jest.fn(),
      deregisterSocket: jest.fn(),
      addParticipant: jest.fn(),
      registerSocket: jest.fn(),
      getParticipants: jest.fn(),
    };

    telemetryServiceMock = {
      incrementFailedAuth: jest.fn(),
      incrementActiveSockets: jest.fn(),
      decrementActiveSockets: jest.fn(),
      incrementWebRtcSignals: jest.fn(),
    };

    wsJwtStrategyMock = {
      validate: jest.fn(),
    };

    prismaMock = {
      webhookEvent: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      paymentIntent: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemedicineGateway,
        PaymentService,
        { provide: TelemedicineAuthorizationService, useValue: authServiceMock },
        { provide: RoomStateService, useValue: roomStateServiceMock },
        { provide: TelemetryService, useValue: telemetryServiceMock },
        { provide: WsJwtStrategy, useValue: wsJwtStrategyMock },
        { provide: StripeService, useValue: {} },
        { provide: RazorpayService, useValue: {} },
        { provide: PrismaService, useValue: prismaMock },
      ],
    })
      .overrideGuard(WsJwtGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const client = context.switchToWs().getClient();
          return !!client['user'];
        },
      })
      .compile();

    gateway = module.get<TelemedicineGateway>(TelemedicineGateway);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe('WebSocket SDP Hijacking & Unauthorized Injection Simulation', () => {
    it('should reject SDP offer if sender is NOT a registered member of the target room', async () => {
      const mockClient = {
        id: 'socket_hacker',
        emit: jest.fn(),
        ['user']: { id: 'user_hacker', role: 'PATIENT' },
      } as any as Socket;

      // Hacker tries to send signal to room 101, but they are not in room 101
      roomStateServiceMock.getParticipants.mockResolvedValue([
        { userId: 'user_legit_doctor', role: 'DOCTOR' },
        { userId: 'user_legit_patient', role: 'PATIENT' },
      ]);

      const signalPayload = {
        roomId: 'room_101',
        offer: { type: 'offer', sdp: 'hijacked_sdp_payload' },
      };

      await gateway.handleOffer(mockClient, signalPayload);

      expect(mockClient.emit).toHaveBeenCalledWith('unauthorized-room', {
        message: 'Action not allowed',
      });
      expect(telemetryServiceMock.incrementWebRtcSignals).not.toHaveBeenCalled();
    });

    it('should accept SDP offer if sender IS a valid registered room member', async () => {
      const mockClient = {
        id: 'socket_legit',
        emit: jest.fn(),
        to: jest.fn().mockReturnValue({ emit: jest.fn() }),
        ['user']: { id: 'user_legit_doctor', role: 'DOCTOR' },
      } as any as Socket;

      gateway.server = {
        to: jest.fn().mockReturnValue({ emit: jest.fn() }),
      } as any;

      roomStateServiceMock.getParticipants.mockResolvedValue([
        { userId: 'user_legit_doctor', role: 'DOCTOR' },
        { userId: 'user_legit_patient', role: 'PATIENT' },
      ]);

      const signalPayload = {
        roomId: 'room_101',
        offer: { type: 'offer', sdp: 'legit_sdp_payload' },
      };

      await gateway.handleOffer(mockClient, signalPayload);

      expect(mockClient.emit).not.toHaveBeenCalledWith('unauthorized-room', expect.any(Object));
      expect(telemetryServiceMock.incrementWebRtcSignals).toHaveBeenCalled();
    });
  });

  describe('Authentication Tampering & Forged Escalation Simulations', () => {
    it('should fail socket connection when JWT signature verification fails', async () => {
      const mockClient = {
        id: 'socket_tampered',
        disconnect: jest.fn(),
        handshake: {
          auth: { token: 'Bearer tampered_signature_jwt' },
        },
      } as any as Socket;

      wsJwtStrategyMock.validate.mockRejectedValue(new Error('Invalid signature'));

      await gateway.handleConnection(mockClient);

      expect(wsJwtStrategyMock.validate).toHaveBeenCalledWith('tampered_signature_jwt');
      expect(telemetryServiceMock.incrementFailedAuth).toHaveBeenCalledWith('ws_handshake_invalid');
      expect(mockClient.disconnect).toHaveBeenCalledWith(true);
    });

    it('should fail connection when JWT is fully expired', async () => {
      const mockClient = {
        id: 'socket_expired',
        disconnect: jest.fn(),
        handshake: {
          headers: { authorization: 'Bearer expired_jwt_replay' },
        },
      } as any as Socket;

      wsJwtStrategyMock.validate.mockRejectedValue(new Error('Token expired'));

      await gateway.handleConnection(mockClient);

      expect(mockClient.disconnect).toHaveBeenCalledWith(true);
      expect(telemetryServiceMock.incrementFailedAuth).toHaveBeenCalledWith('ws_handshake_invalid');
    });
  });

  describe('Payment Webhook Replay & Idempotency Abuse Simulation', () => {
    it('should suppress duplicate/replayed payment webhook events immediately (idempotency)', async () => {
      const eventId = 'evt_duplicate_123';
      
      // Simulate that the event is already stored in the DB
      prismaMock.webhookEvent.findUnique.mockResolvedValue({
        eventId,
        status: 'PROCESSED',
      });

      await paymentService.processWebhookEvent('STRIPE', eventId, 'payment_intent.succeeded', {
        data: { object: { id: 'pi_123' } },
      });

      // Assert database lookup was performed, but no state modification or creation occurred
      expect(prismaMock.webhookEvent.findUnique).toHaveBeenCalledWith({
        where: { eventId },
      });
      expect(prismaMock.paymentIntent.update).not.toHaveBeenCalled();
      expect(prismaMock.webhookEvent.create).not.toHaveBeenCalled();
    });

    it('should process webhook event successfully if it is brand new', async () => {
      const eventId = 'evt_new_789';
      
      prismaMock.webhookEvent.findUnique.mockResolvedValue(null);
      prismaMock.paymentIntent.update.mockResolvedValue({ id: 'pi_789' });

      await paymentService.processWebhookEvent('STRIPE', eventId, 'payment_intent.succeeded', {
        data: { object: { id: 'pi_789' } },
      });

      expect(prismaMock.paymentIntent.update).toHaveBeenCalledWith({
        where: { providerId: 'pi_789' },
        data: { status: 'SUCCEEDED' },
      });
      expect(prismaMock.webhookEvent.create).toHaveBeenCalledWith({
        data: {
          provider: 'STRIPE',
          eventId,
          eventType: 'payment_intent.succeeded',
          payload: expect.any(Object),
          status: 'PROCESSED',
        },
      });
    });
  });
});
