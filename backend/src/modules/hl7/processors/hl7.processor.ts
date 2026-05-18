import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Hl7Service } from '../hl7.service';
import { Hl7Parser } from '../parser/hl7.parser';

@Injectable()
@Processor('hl7-ingestion')
export class Hl7Processor extends WorkerHost {
  private readonly logger = new Logger('Hl7Processor');

  constructor(private readonly hl7Service: Hl7Service) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { raw, tenantId, controlId, messageType } = job.data;
    this.logger.log(`Processing HL7 job ${job.id} - Type: ${messageType}, Control ID: ${controlId}`);

    try {
      const parsed = Hl7Parser.parse(raw);

      if (messageType.startsWith('ADT')) {
        // Patient ADT registration / updates / transfer
        const result = await this.hl7Service.processPatientAdt(parsed, tenantId);
        return { success: true, patientId: result.id };
      } else if (messageType.startsWith('ORM') || messageType.startsWith('ORU')) {
        // Lab orders / observation results
        const result = await this.hl7Service.processLabOrderOrResult(parsed, tenantId);
        return { success: true, recordId: result.id };
      } else {
        throw new Error(`Unsupported HL7 message type mapping request: ${messageType}`);
      }
    } catch (err: any) {
      this.logger.error(`HL7 background process failed for controlId: ${controlId}: ${err.message}`, err.stack);
      
      // Move to Dead Letter Queue for operator audit and recovery
      await this.hl7Service.sendToDeadLetter(job.data, err.message);
      
      throw err; // Fail BullMQ job status cleanly
    }
  }
}
