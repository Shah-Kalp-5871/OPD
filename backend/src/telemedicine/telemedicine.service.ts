import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelemedicineService {
  private readonly logger = new Logger(TelemedicineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateTurnCredentials(roomId: string, userId: string) {
    this.logger.log(`Generating TURN credentials for room ${roomId} by user ${userId}`);
    // In production, this would securely call the Coturn REST API
    // For now, we return placeholder credentials to unblock the client
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:turn.medflow.internal:3478',
          username: `medflow_${roomId}`,
          credential: 'secure_turn_password_placeholder',
        },
      ],
    };
  }

  async logSessionEnd(sessionId: string, durationSeconds: number, qualityMetrics: any) {
    this.logger.log(`Logging telemedicine session end for ${sessionId}`);
    try {
      await this.prisma.telemedicineSessionLog.update({
        where: { sessionId },
        data: {
          endTime: new Date(),
          durationSeconds,
          qualityMetrics,
        },
      });
    } catch (e: any) {
      this.logger.error(`Failed to log session end: ${e.message}`);
    }
  }
}
