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
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/telemedicine',
})
export class TelemedicineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TelemedicineGateway.name);
  
  // Maps socketId to roomId
  private activeConnections = new Map<string, string>();

  handleConnection(client: Socket) {
    this.logger.log(`Telemedicine client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Telemedicine client disconnected: ${client.id}`);
    const roomId = this.activeConnections.get(client.id);
    if (roomId) {
      this.server.to(roomId).emit('peer-disconnected', { peerId: client.id });
      this.activeConnections.delete(client.id);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    client.join(roomId);
    this.activeConnections.set(client.id, roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
    
    // Notify others in the room
    client.to(roomId).emit('user-joined', { peerId: client.id });
  }

  @SubscribeMessage('offer')
  handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; offer: any; targetPeerId?: string },
  ) {
    this.logger.log(`Offer from ${client.id} in room ${data.roomId}`);
    if (data.targetPeerId) {
       client.to(data.targetPeerId).emit('offer', { peerId: client.id, offer: data.offer });
    } else {
       client.to(data.roomId).emit('offer', { peerId: client.id, offer: data.offer });
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; answer: any; targetPeerId?: string },
  ) {
    this.logger.log(`Answer from ${client.id} in room ${data.roomId}`);
    if (data.targetPeerId) {
      client.to(data.targetPeerId).emit('answer', { peerId: client.id, answer: data.answer });
    } else {
      client.to(data.roomId).emit('answer', { peerId: client.id, answer: data.answer });
    }
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; candidate: any; targetPeerId?: string },
  ) {
    if (data.targetPeerId) {
      client.to(data.targetPeerId).emit('ice-candidate', { peerId: client.id, candidate: data.candidate });
    } else {
      client.to(data.roomId).emit('ice-candidate', { peerId: client.id, candidate: data.candidate });
    }
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(data.roomId);
    this.activeConnections.delete(client.id);
    this.server.to(data.roomId).emit('peer-disconnected', { peerId: client.id });
    this.logger.log(`Client ${client.id} left room ${data.roomId}`);
  }
}
