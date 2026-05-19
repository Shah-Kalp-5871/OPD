import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class Hl7BridgeService {
  private readonly logger = new Logger(Hl7BridgeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async parseAndLogHl7(data: { messageType: string; direction: string; rawContent: string }) {
    const tenantId = this.getTenantId();
    
    // Simulate raw HL7 parser processing ADT / ORU messages
    let parsedJson = {};
    let status = 'SUCCESS';
    let errorMessage: string | null = null;

    try {
      if (!data.rawContent.includes('MSH')) {
        throw new Error('Invalid HL7 message header: Missing MSH segment');
      }

      // Simple mock parser of HL7 pipe notation
      const segments = data.rawContent.split('\n');
      const parsedSegments: any = {};
      segments.forEach((seg) => {
        const fields = seg.split('|');
        const segName = fields[0];
        if (segName) {
          parsedSegments[segName] = fields.slice(1);
        }
      });

      parsedJson = {
        header: parsedSegments['MSH'] || [],
        patient: parsedSegments['PID'] || [],
        order: parsedSegments['OBR'] || [],
        observation: parsedSegments['OBX'] || [],
      };
    } catch (err: any) {
      status = 'FAILED';
      errorMessage = err.message;
    }

    const log = await this.prisma.hl7TranslationLog.create({
      data: {
        tenantId,
        messageType: data.messageType,
        direction: data.direction,
        rawContent: data.rawContent,
        parsedJson,
        status,
        errorMessage,
      },
    });

    return log;
  }

  async getLogs() {
    const tenantId = this.getTenantId();
    return this.prisma.hl7TranslationLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
