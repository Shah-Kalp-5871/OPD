import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AppGateway } from '../socket/app.gateway';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appGateway: AppGateway,
  ) {}

  async createMessage(dto: CreateMessageDto, senderId: string, tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is missing');
    }
    
    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        senderId,
        recipientId: dto.recipientId,
        roomId: dto.roomId,
        type: dto.type || 'TEXT',
        tenantId,
      },
    });

    // Populate sender details for frontend display
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { firstName: true, lastName: true, role: true },
    });

    const broadcastPayload = {
      ...message,
      sender: sender ? `${sender.firstName} ${sender.lastName}` : 'System',
      senderRole: sender?.role,
    };

    if (dto.recipientId) {
      this.appGateway.sendToUser(dto.recipientId, 'new_message', broadcastPayload);
    } else if (dto.roomId) {
      this.appGateway.broadcastToRoom(dto.roomId, 'new_message', broadcastPayload);
    } else {
      // Global chat
      this.appGateway.broadcastGlobal('new_message', broadcastPayload);
    }

    return message;
  }

  async getRecentMessages(tenantId: string) {
    return this.prisma.message.findMany({
      where: { tenantId, roomId: null, recipientId: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
