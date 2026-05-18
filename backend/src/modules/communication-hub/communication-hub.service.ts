import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommunicationHubService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(tenantId: string, senderId: string, content: string, recipientId?: string, roomId?: string, type = 'TEXT') {
    return this.prisma.message.create({
      data: { tenantId, senderId, recipientId, roomId, content, type },
    });
  }

  async getMessages(tenantId: string, opts: { recipientId?: string; roomId?: string; senderId?: string }) {
    return this.prisma.message.findMany({
      where: {
        tenantId,
        ...(opts.roomId ? { roomId: opts.roomId } :
          opts.recipientId ? {
            OR: [
              { senderId: opts.senderId, recipientId: opts.recipientId },
              { senderId: opts.recipientId, recipientId: opts.senderId },
            ],
          } : {}),
      },
      include: { attachments: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async markRead(tenantId: string, messageId: string) {
    return this.prisma.message.updateMany({
      where: { id: messageId, tenantId },
      data: { readAt: new Date() },
    });
  }

  async addAttachment(messageId: string, fileName: string, fileUrl: string, fileSize: number, mimeType: string) {
    return this.prisma.messageAttachment.create({
      data: { messageId, fileName, fileUrl, fileSize, mimeType, scanned: false },
    });
  }
}
