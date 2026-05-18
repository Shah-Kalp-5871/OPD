import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class TelemedicineV2Service {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(tenantId: string, patientId: string, doctorId: string, recordingConsent = false) {
    const roomId = `room-${crypto.randomUUID()}`;
    const turnCredential = {
      username: crypto.randomBytes(8).toString('hex'),
      credential: crypto.randomBytes(16).toString('hex'),
      ttl: 3600,
      uris: ['stun:stun.medflow.io:3478', 'turn:turn.medflow.io:3478'],
    };

    return this.prisma.telemedicineSession.create({
      data: { tenantId, patientId, doctorId, roomId, recordingConsent, turnCredential },
    });
  }

  async startSession(tenantId: string, sessionId: string) {
    const session = await this.prisma.telemedicineSession.findFirst({
      where: { id: sessionId, tenantId },
    });
    if (!session) throw new NotFoundException('Session not found');

    return this.prisma.telemedicineSession.update({
      where: { id: sessionId },
      data: { status: 'ACTIVE', startedAt: new Date() },
    });
  }

  async endSession(tenantId: string, sessionId: string) {
    const session = await this.prisma.telemedicineSession.findFirst({
      where: { id: sessionId, tenantId },
    });
    if (!session) throw new NotFoundException('Session not found');

    const endedAt = new Date();
    const durationSeconds = session.startedAt
      ? Math.round((endedAt.getTime() - session.startedAt.getTime()) / 1000)
      : 0;

    return this.prisma.telemedicineSession.update({
      where: { id: sessionId },
      data: { status: 'ENDED', endedAt, durationSeconds },
    });
  }

  async joinSession(sessionId: string, userId: string, role: string) {
    const [participant] = await Promise.all([
      this.prisma.sessionParticipant.create({
        data: { sessionId, userId, role },
      }),
      this.prisma.sessionEvent.create({
        data: { sessionId, type: 'JOIN', userId },
      }),
    ]);
    return participant;
  }

  async leaveSession(sessionId: string, userId: string) {
    const [participant] = await Promise.all([
      this.prisma.sessionParticipant.updateMany({
        where: { sessionId, userId, leftAt: null },
        data: { leftAt: new Date() },
      }),
      this.prisma.sessionEvent.create({
        data: { sessionId, type: 'LEAVE', userId },
      }),
    ]);
    return participant;
  }

  async getSession(tenantId: string, sessionId: string) {
    return this.prisma.telemedicineSession.findFirst({
      where: { id: sessionId, tenantId },
      include: { participants: true, events: { orderBy: { timestamp: 'asc' } } },
    });
  }

  async getSessions(tenantId: string) {
    return this.prisma.telemedicineSession.findMany({
      where: { tenantId },
      include: { participants: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  generateTurnCredentials() {
    return {
      username: crypto.randomBytes(8).toString('hex'),
      credential: crypto.randomBytes(16).toString('hex'),
      ttl: 3600,
      uris: ['stun:stun.medflow.io:3478', 'turn:turn.medflow.io:3478'],
    };
  }
}
