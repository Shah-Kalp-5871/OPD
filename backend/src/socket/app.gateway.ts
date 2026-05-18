import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict this
  },
  namespace: 'medflow',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);
  private connectedClients: Map<string, string> = new Map(); // socketId -> userId

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedClients.set(client.id, data.userId);
    client.join(`user:${data.userId}`);
    this.logger.log(
      `User authenticated: ${data.userId} on socket ${client.id}`,
    );
    return { status: 'authenticated' };
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.logger.log(`Socket ${client.id} joined room ${data.room}`);
    return { status: 'joined', room: data.room };
  }

  /**
   * Broadcast message to a room
   */
  broadcastToRoom(room: string, event: string, payload: any) {
    this.server.to(room).emit(event, payload);
  }

  /**
   * Send notification to a specific user
   */
  sendToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  /**
   * Global broadcast
   */
  broadcastGlobal(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
