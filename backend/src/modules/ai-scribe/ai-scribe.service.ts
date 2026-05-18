import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiScribeService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(tenantId: string, doctorId: string, patientId: string, encounterId?: string) {
    return this.prisma.scribeSession.create({
      data: { tenantId, doctorId, patientId, encounterId, status: 'RECORDING' },
    });
  }

  async addSegment(sessionId: string, speaker: string, text: string, startMs: number, endMs: number, confidence?: number) {
    const entities = this.extractEntities(text);
    return this.prisma.transcriptSegment.create({
      data: { sessionId, speaker, text, startMs, endMs, confidence, entities },
    });
  }

  private extractEntities(text: string): Record<string, string[]> {
    // Simplified NLP entity extraction — production would use a medical NLP API
    const lowerText = text.toLowerCase();
    const symptoms: string[] = [];
    const medications: string[] = [];

    const symptomKeywords = ['pain', 'fever', 'cough', 'nausea', 'fatigue', 'headache', 'dizziness'];
    const medKeywords = ['paracetamol', 'ibuprofen', 'amoxicillin', 'metformin', 'aspirin', 'atorvastatin'];

    symptomKeywords.forEach(kw => { if (lowerText.includes(kw)) symptoms.push(kw); });
    medKeywords.forEach(kw => { if (lowerText.includes(kw)) medications.push(kw); });

    return { symptoms, medications };
  }

  async processSoapNote(tenantId: string, sessionId: string) {
    const session = await this.prisma.scribeSession.findFirst({
      where: { id: sessionId, tenantId },
      include: { segments: true },
    });
    if (!session) throw new NotFoundException('Scribe session not found');

    const transcript = session.segments.map(s => `${s.speaker}: ${s.text}`).join('\n');
    const allEntities = session.segments.flatMap(s => s.entities as any || []);

    // Generate structured SOAP note from transcript
    const soapNote = {
      subjective: 'Patient reports: ' + session.segments
        .filter(s => s.speaker === 'PATIENT')
        .map(s => s.text)
        .join('. '),
      objective: 'Clinical observations noted during consultation.',
      assessment: 'Based on history and examination findings.',
      plan: 'Follow-up as discussed, prescriptions issued if applicable.',
      generatedAt: new Date().toISOString(),
      confidence: 0.85,
      requiresReview: true,
    };

    return this.prisma.scribeSession.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED', rawTranscript: transcript, soapNote },
    });
  }

  async approveSession(tenantId: string, sessionId: string, doctorId: string) {
    return this.prisma.scribeSession.updateMany({
      where: { id: sessionId, tenantId },
      data: { status: 'APPROVED', approvedAt: new Date(), approvedBy: doctorId },
    });
  }

  async getSession(tenantId: string, sessionId: string) {
    return this.prisma.scribeSession.findFirst({
      where: { id: sessionId, tenantId },
      include: { segments: { orderBy: { startMs: 'asc' } } },
    });
  }

  async getSessions(tenantId: string) {
    return this.prisma.scribeSession.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
