import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsJwtStrategy } from '../ws-jwt.strategy';
import { TelemetryService } from '../../../metrics/telemetry.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private readonly wsJwtStrategy: WsJwtStrategy,
    private readonly telemetryService: TelemetryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<Socket>();
      const token = this.extractToken(client);

      if (!token) {
        this.logger.warn(`Unauthenticated WebSocket connection attempt from client ${client.id}`);
        this.telemetryService.incrementFailedAuth('ws_anonymous');
        throw new WsException('Unauthorized');
      }

      const user = await this.wsJwtStrategy.validate(token);
      client['user'] = user; // Attach to socket instance for context retention
      
      return true;
    } catch (err: any) {
      const client = context.switchToWs().getClient<Socket>();
      this.logger.warn(`Failed WebSocket authentication for client ${client.id}: ${err.message}`);
      this.telemetryService.incrementFailedAuth('ws_invalid');
      client.emit('unauthorized', { message: 'Authentication failed' });
      client.disconnect(true);
      throw new WsException('Unauthorized');
    }
  }

  private extractToken(client: Socket): string | null {
    // 1. Check auth handshake payload
    let token = client.handshake.auth?.token;
    if (token) {
      return token.replace('Bearer ', '');
    }

    // 2. Check auth header
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader) {
      return authHeader.replace('Bearer ', '');
    }

    // 3. Check query string
    token = client.handshake.query?.token;
    if (typeof token === 'string') {
      return token.replace('Bearer ', '');
    }

    return null;
  }
}
