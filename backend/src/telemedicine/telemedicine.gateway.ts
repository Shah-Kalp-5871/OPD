import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './auth/guards/ws-jwt.guard';
import { TelemedicineAuthorizationService } from './services/telemedicine-authorization.service';
import { RoomStateService, RoomParticipant } from './redis/room-state.service';
import { TelemetryService } from '../metrics/telemetry.service';
import { WsJwtStrategy } from './auth/ws-jwt.strategy';

interface JoinRoomDto {
  roomId: string;
}

interface SignalDto {
  roomId: string;
  offer?: unknown;
  answer?: unknown;
  candidate?: unknown;
  targetPeerId?: string;
}

@WebSocketGateway({
  namespace: '/telemedicine',
})
export class TelemedicineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TelemedicineGateway.name);

  constructor(
    private readonly authService: TelemedicineAuthorizationService,
    private readonly roomStateService: RoomStateService,
    private readonly telemetryService: TelemetryService,
    private readonly wsJwtStrategy: WsJwtStrategy,
  ) {}

  /**
   * Validates incoming socket connection handshake details, forcing disconnection of invalid sessions.
   */
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractHandshakeToken(client);
      if (!token) {
        this.logger.warn(`Handshake blocked: Anonymous WebSocket connection attempt ${client.id}`);
        this.telemetryService.incrementFailedAuth('ws_handshake_anonymous');
        client.disconnect(true);
        return;
      }

      const user = await this.wsJwtStrategy.validate(token);
      client['user'] = user; // Pre-cache authenticated context on connection
      this.logger.log(`Telemedicine user authenticated: ${user.id} (${user.role}) on socket ${client.id}`);
      this.telemetryService.incrementActiveSockets();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown authentication error';
      this.logger.warn(`Handshake blocked: Failed connection auth for client ${client.id}: ${errMsg}`);
      this.telemetryService.incrementFailedAuth('ws_handshake_invalid');
      client.disconnect(true);
    }
  }

  /**
   * Cleans up room membership state upon socket termination.
   */
  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Telemedicine socket disconnected: ${client.id}`);
    this.telemetryService.decrementActiveSockets();

    try {
      const mapping = await this.roomStateService.getSocketMapping(client.id);
      if (mapping) {
        const { roomId, userId } = mapping;
        this.logger.log(`Cleaning up room state for user ${userId} in room ${roomId} on socket disconnect`);
        
        await this.roomStateService.removeParticipant(roomId, userId);
        await this.roomStateService.deregisterSocket(client.id);

        // Broadcast disconnect to room members
        this.server.to(roomId).emit('peer-disconnected', { peerId: client.id, userId });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown cleanup error';
      this.logger.error(`Error during socket disconnect cleanup for ${client.id}: ${errMsg}`);
    }
  }

  /**
   * Implements secure clinical access control check before allowing a client to join a consultation room.
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ): Promise<void> {
    const { roomId } = data;
    const user = client['user'];

    if (!user || !user.id || !user.role) {
      this.logger.warn(`Rejecting join-room: Socket ${client.id} is unauthenticated`);
      client.emit('unauthorized-room', { message: 'Authentication required' });
      return;
    }

    try {
      // 1. Verify clinical and authorization permissions (Appointment, Time Window, Payment/FOC)
      const isAuthorized = await this.authService.authorizeRoomAccess(user.id, user.role, roomId);
      if (!isAuthorized) {
        this.logger.warn(`Unauthorized join attempt by ${user.id} for room ${roomId}`);
        client.emit('unauthorized-room', { message: 'Room access unauthorized or session expired' });
        return;
      }

      // 2. Join the Socket.IO room pool
      client.join(roomId);

      // 3. Register state to Redis for stateless horizontal cluster replication
      await this.roomStateService.addParticipant(roomId, user.id, user.role, client.id);
      await this.roomStateService.registerSocket(client.id, roomId, user.id);

      this.logger.log(`Authorized client ${user.id} (${user.role}) successfully joined room ${roomId}`);

      // 4. Notify existing room members of the new arrival
      client.to(roomId).emit('user-joined', { peerId: client.id, userId: user.id, role: user.role });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown authorization error';
      this.logger.error(`Room join authorization failed for user ${user?.id} in room ${roomId}: ${errMsg}`);
      client.emit('unauthorized-room', { message: errMsg });
    }
  }

  /**
   * WebRTC Signaling: Transmits Offer package with Zero-Trust membership check.
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('offer')
  async handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SignalDto,
  ): Promise<void> {
    const user = client['user'];
    const isAuthorized = await this.verifyRoomMembership(data.roomId, user?.id);
    if (!isAuthorized) {
      this.logger.warn(`Security alert: User ${user?.id} attempted to transmit offer in unauthorized room ${data.roomId}`);
      client.emit('unauthorized-room', { message: 'Action not allowed' });
      return;
    }

    this.telemetryService.incrementWebRtcSignals();
    this.logger.log(`Offer from ${client.id} in room ${data.roomId}`);

    if (data.targetPeerId) {
      client.to(data.targetPeerId).emit('offer', { peerId: client.id, offer: data.offer });
    } else {
      client.to(data.roomId).emit('offer', { peerId: client.id, offer: data.offer });
    }
  }

  /**
   * WebRTC Signaling: Transmits Answer package with Zero-Trust membership check.
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('answer')
  async handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SignalDto,
  ): Promise<void> {
    const user = client['user'];
    const isAuthorized = await this.verifyRoomMembership(data.roomId, user?.id);
    if (!isAuthorized) {
      this.logger.warn(`Security alert: User ${user?.id} attempted to transmit answer in unauthorized room ${data.roomId}`);
      client.emit('unauthorized-room', { message: 'Action not allowed' });
      return;
    }

    this.telemetryService.incrementWebRtcSignals();
    this.logger.log(`Answer from ${client.id} in room ${data.roomId}`);

    if (data.targetPeerId) {
      client.to(data.targetPeerId).emit('answer', { peerId: client.id, answer: data.answer });
    } else {
      client.to(data.roomId).emit('answer', { peerId: client.id, answer: data.answer });
    }
  }

  /**
   * WebRTC Signaling: Transmits ICE Candidate package with Zero-Trust membership check.
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('ice-candidate')
  async handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SignalDto,
  ): Promise<void> {
    const user = client['user'];
    const isAuthorized = await this.verifyRoomMembership(data.roomId, user?.id);
    if (!isAuthorized) {
      this.logger.warn(`Security alert: User ${user?.id} attempted to transmit ICE Candidate in unauthorized room ${data.roomId}`);
      client.emit('unauthorized-room', { message: 'Action not allowed' });
      return;
    }

    this.telemetryService.incrementWebRtcSignals();
    if (data.targetPeerId) {
      client.to(data.targetPeerId).emit('ice-candidate', { peerId: client.id, candidate: data.candidate });
    } else {
      client.to(data.roomId).emit('ice-candidate', { peerId: client.id, candidate: data.candidate });
    }
  }

  /**
   * Graceful Leave Room workflow.
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ): Promise<void> {
    const { roomId } = data;
    const user = client['user'];

    if (user && user.id) {
      this.logger.log(`Client ${client.id} (${user.id}) leaving room ${roomId}`);
      await this.roomStateService.removeParticipant(roomId, user.id);
      await this.roomStateService.deregisterSocket(client.id);
    }

    client.leave(roomId);
    this.server.to(roomId).emit('peer-disconnected', { peerId: client.id, userId: user?.id });
  }

  /**
   * Zero-Trust check: Verifies if a user is actively registered in a room's participant list in Redis.
   */
  private async verifyRoomMembership(roomId: string, userId?: string): Promise<boolean> {
    if (!userId) return false;
    const participants = await this.roomStateService.getParticipants(roomId);
    return participants.some((p: RoomParticipant) => p.userId === userId);
  }

  /**
   * Extracts Bearer tokens from various socket connection protocols.
   */
  private extractHandshakeToken(client: Socket): string | null {
    let token = client.handshake.auth?.token;
    if (token) return token.replace('Bearer ', '');

    const authHeader = client.handshake.headers?.authorization;
    if (authHeader) return authHeader.replace('Bearer ', '');

    token = client.handshake.query?.token;
    if (typeof token === 'string') return token.replace('Bearer ', '');

    return null;
  }
}
