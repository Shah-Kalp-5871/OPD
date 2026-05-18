import { Test, TestingModule } from '@nestjs/testing';
import { WsJwtGuard } from './ws-jwt.guard';
import { WsJwtStrategy } from '../ws-jwt.strategy';
import { TelemetryService } from '../../../metrics/telemetry.service';
import { ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

describe('WsJwtGuard Integration & Security Abuse Tests', () => {
  let guard: WsJwtGuard;
  let wsJwtStrategyMock: any;
  let telemetryServiceMock: any;

  beforeEach(async () => {
    wsJwtStrategyMock = {
      validate: jest.fn(),
    };

    telemetryServiceMock = {
      incrementFailedAuth: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WsJwtGuard,
        { provide: WsJwtStrategy, useValue: wsJwtStrategyMock },
        { provide: TelemetryService, useValue: telemetryServiceMock },
      ],
    }).compile();

    guard = module.get<WsJwtGuard>(WsJwtGuard);
  });

  const createMockContext = (handshakeData: { auth?: any; headers?: any; query?: any }): ExecutionContext => {
    const mockSocket = {
      id: 'socket-999',
      handshake: handshakeData,
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    return {
      switchToWs: () => ({
        getClient: () => mockSocket,
      }),
    } as unknown as ExecutionContext;
  };

  describe('JWT Handshake Authentication', () => {
    it('should validate and connect with a valid JWT in handshake auth payload', async () => {
      const context = createMockContext({
        auth: { token: 'Bearer valid-jwt-token' },
      });
      const expectedUser = { id: 'u-1', email: 'doc@medflow.com', role: 'DOCTOR' };
      wsJwtStrategyMock.validate.mockResolvedValue(expectedUser);

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
      expect(wsJwtStrategyMock.validate).toHaveBeenCalledWith('valid-jwt-token');

      const client = context.switchToWs().getClient<any>();
      expect(client.user).toEqual(expectedUser);
    });

    it('should reject handshake connection when JWT is missing', async () => {
      const context = createMockContext({});
      const client = context.switchToWs().getClient<any>();

      await expect(guard.canActivate(context)).rejects.toThrow(WsException);
      expect(telemetryServiceMock.incrementFailedAuth).toHaveBeenCalledWith('ws_anonymous');
    });

    it('should reject connection when token verification throws an error (e.g. Expired)', async () => {
      const context = createMockContext({
        auth: { token: 'Bearer expired-jwt-token' },
      });
      wsJwtStrategyMock.validate.mockRejectedValue(new Error('jwt expired'));
      const client = context.switchToWs().getClient<any>();

      await expect(guard.canActivate(context)).rejects.toThrow(WsException);
      expect(telemetryServiceMock.incrementFailedAuth).toHaveBeenCalledWith('ws_invalid');
      expect(client.emit).toHaveBeenCalledWith('unauthorized', { message: 'Authentication failed' });
      expect(client.disconnect).toHaveBeenCalledWith(true);
    });

    it('should reject connection when token is malformed', async () => {
      const context = createMockContext({
        auth: { token: 'malformed_payload' },
      });
      wsJwtStrategyMock.validate.mockRejectedValue(new Error('Invalid token'));
      const client = context.switchToWs().getClient<any>();

      await expect(guard.canActivate(context)).rejects.toThrow(WsException);
      expect(telemetryServiceMock.incrementFailedAuth).toHaveBeenCalledWith('ws_invalid');
      expect(client.disconnect).toHaveBeenCalledWith(true);
    });
  });

  describe('Origin & Protocol Tampering Abuse Simulation', () => {
    it('should intercept client with headers manipulation and verify disconnection', async () => {
      const context = createMockContext({
        headers: { authorization: 'Bearer forged-malformed-token' },
      });
      wsJwtStrategyMock.validate.mockRejectedValue(new Error('Signature verification failed'));
      const client = context.switchToWs().getClient<any>();

      await expect(guard.canActivate(context)).rejects.toThrow(WsException);
      expect(client.disconnect).toHaveBeenCalledWith(true);
    });

    it('should handle token passed via query string parameter securely', async () => {
      const context = createMockContext({
        query: { token: 'Bearer valid-query-token' },
      });
      wsJwtStrategyMock.validate.mockResolvedValue({ id: 'u-2', role: 'PATIENT' });

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
      expect(wsJwtStrategyMock.validate).toHaveBeenCalledWith('valid-query-token');
    });
  });
});
