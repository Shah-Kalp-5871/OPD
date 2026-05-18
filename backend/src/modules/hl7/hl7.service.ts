import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { Hl7Parser, Hl7ParsedMessage } from './parser/hl7.parser';
import { TelemetryService } from '../../metrics/telemetry.service';
import { Gender } from '@prisma/client';

@Injectable()
export class Hl7Service {
  private readonly logger = new Logger('Hl7Service');

  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetryService: TelemetryService,
    @InjectQueue('hl7-ingestion') private readonly ingestionQueue: Queue,
    @InjectQueue('hl7-processing') private readonly processingQueue: Queue,
    @InjectQueue('hl7-dead-letter') private readonly deadLetterQueue: Queue,
  ) {}

  /**
   * Receives a raw HL7 v2 string, tokenizes it, queues for processing, and returns synchronous ACK
   */
  async ingestMessage(rawHl7: string, tenantId: string): Promise<string> {
    try {
      this.logger.log(`Ingesting new HL7 v2 message for Tenant: ${tenantId}`);
      const parsed = Hl7Parser.parse(rawHl7);
      this.telemetryService.incrementHl7MessagesParsed();

      // Validate MSH segment presence
      const msh = parsed.getSegment('MSH');
      if (!msh) {
        throw new Error('MSH segment is missing, invalid HL7 message format');
      }

      // Enqueue onto ingestion queue
      await this.ingestionQueue.add('ingest', {
        raw: rawHl7,
        tenantId,
        controlId: parsed.controlId,
        messageType: parsed.messageType,
      });

      return Hl7Parser.generateAck(parsed, 'AA');
    } catch (err: any) {
      this.logger.error(`HL7 Ingestion failed: ${err.message}`, err.stack);
      
      // Fallback ACK in case parsing broke completely
      return `MSH|^~\\&|MedFlowEMR|MedFlowFacility|UNKNOWN|UNKNOWN|${new Date().toISOString()}||ACK^A01^ACK|ERR|P|2.4\rMSA|AE|UNKNOWN|${err.message}`;
    }
  }

  /**
   * Processes a tokenized HL7 ADT Patient record
   */
  async processPatientAdt(parsed: Hl7ParsedMessage, tenantId: string): Promise<any> {
    const pid = parsed.getSegment('PID');
    if (!pid) throw new Error('PID segment missing in ADT message');

    const mrdNumber = parsed.getFieldValue('PID', 3, 0) || `MRD-${Math.floor(Math.random() * 1000000)}`;
    const familyName = parsed.getFieldValue('PID', 5, 0) || '';
    const givenName = parsed.getFieldValue('PID', 5, 1) || '';
    const dobRaw = parsed.getFieldValue('PID', 7, 0); // e.g. YYYYMMDD
    const genderRaw = parsed.getFieldValue('PID', 8, 0); // M/F/U
    const mobileRaw = parsed.getFieldValue('PID', 13, 0);
    const mobile = mobileRaw || `+1${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const genderEnum = genderRaw === 'M' ? Gender.MALE : genderRaw === 'F' ? Gender.FEMALE : Gender.UNKNOWN;
    const gender = genderRaw === 'M' ? 'Male' : genderRaw === 'F' ? 'Female' : 'Unknown';

    let dob: Date | null = null;
    if (dobRaw && dobRaw.length >= 8) {
      const year = parseInt(dobRaw.substring(0, 4), 10);
      const month = parseInt(dobRaw.substring(4, 6), 10) - 1;
      const day = parseInt(dobRaw.substring(6, 8), 10);
      dob = new Date(year, month, day);
    }

    // Process patient registration transactional upsert
    const patient = await this.prisma.patient.upsert({
      where: {
        mrdNumber,
      },
      update: {
        firstName: givenName,
        lastName: familyName,
        mobile,
        gender,
        genderEnum,
        profile: {
          update: {
            dob,
          },
        },
      },
      create: {
        mrdNumber,
        firstName: givenName,
        lastName: familyName,
        mobile,
        gender,
        genderEnum,
        profile: {
          create: {
            dob,
          },
        },
      },
      include: { profile: true },
    });

    this.logger.log(`Successfully processed ADT Patient Upsert: ${patient.firstName} ${patient.lastName} (${mrdNumber})`);
    return patient;
  }

  /**
   * Processes a tokenized HL7 ORM/ORU Lab Order / Result
   */
  async processLabOrderOrResult(parsed: Hl7ParsedMessage, tenantId: string): Promise<any> {
    const pid = parsed.getSegment('PID');
    if (!pid) throw new Error('PID segment missing in ORU message');

    const mrdNumber = parsed.getFieldValue('PID', 3, 0);
    if (!mrdNumber) throw new Error('Missing Patient MRD number in PID.3');

    // Fetch patient matching MRD
    const patient = await this.prisma.patient.findFirst({
      where: { mrdNumber, deletedAt: null },
    });

    if (!patient) {
      throw new Error(`Patient MRD ${mrdNumber} not found under tenant ${tenantId}`);
    }

    const obr = parsed.getSegment('OBR');
    if (!obr) throw new Error('OBR segment missing in lab transaction');

    const testCode = parsed.getFieldValue('OBR', 4, 0) || 'LAB-TEST';
    const testName = parsed.getFieldValue('OBR', 4, 1) || 'Standard investigation';
    const caseId = parsed.getFieldValue('PV1', 19, 0) || null; // pv1.19 contains visit number

    const obx = parsed.getSegment('OBX');
    const findings = obx ? parsed.getFieldValue('OBX', 5, 0) || 'Completed' : 'Completed';

    let activeCaseId = caseId;
    if (!activeCaseId) {
      const latestCase = await this.prisma.patientCase.findFirst({
        where: { patientId: patient.id },
        orderBy: { createdAt: 'desc' },
      });
      if (latestCase) {
        activeCaseId = latestCase.id;
      }
    }

    if (!activeCaseId) {
      throw new Error(`No clinical encounter found for Patient MRD ${mrdNumber}. Unable to process HL7 lab transaction.`);
    }

    const patientCase = await this.prisma.patientCase.findUnique({
      where: { id: activeCaseId },
    });
    if (!patientCase) {
      throw new Error(`Encounter Case ID ${activeCaseId} not found.`);
    }
    const branchId = patientCase.branchId;
    const doctorId = patientCase.doctorId;

    // Create custom diagnostic lab record
    const labOrder = await this.prisma.investigationOrder.create({
      data: {
        caseId: activeCaseId,
        doctorId: doctorId || 'hl7-system',
        status: 'COMPLETED',
        branchId,
        notes: `Processed via HL7 Message: ${parsed.messageType}. OBR: ${testCode} - ${testName}. Findings: ${findings}`,
      },
    });

    this.logger.log(`Successfully processed HL7 Lab record: ${testName} for MRD: ${mrdNumber}`);
    return labOrder;
  }

  /**
   * Moves a failed job context to the Dead Letter Queue
   */
  async sendToDeadLetter(jobData: any, errorMsg: string): Promise<void> {
    this.logger.warn(`Moving failed HL7 transaction to Dead-Letter Queue: ${errorMsg}`);
    this.telemetryService.incrementHl7DeadLetterQueue();
    await this.deadLetterQueue.add('failed-hl7', {
      ...jobData,
      failedAt: new Date().toISOString(),
      error: errorMsg,
    });
  }
}
