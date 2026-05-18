import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../../prisma/prisma.service';
import { FhirMapper } from '../mappers/fhir.mapper';
import { TelemetryService } from '../../../metrics/telemetry.service';

@Injectable()
@Processor('fhir-export')
export class FhirExportProcessor extends WorkerHost {
  private readonly logger = new Logger('FhirExportProcessor');

  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FhirMapper,
    private readonly telemetryService: TelemetryService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const startTime = Date.now();
    const { jobId, tenantId } = job.data;
    this.logger.log(`Starting FHIR Bulk Export process for Job ID: ${jobId}, Tenant: ${tenantId}`);

    // Update job status to PROCESSING
    await this.prisma.exportJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING' },
    });

    try {
      // 1. Gather all tenant data
      const patients = await this.prisma.patient.findMany({
        where: {
          OR: [
            {
              cases: {
                some: {
                  branch: {
                    clinic: {
                      tenantId,
                    },
                  },
                },
              },
            },
            {
              createdBy: {
                tenantUsers: {
                  some: {
                    tenantId,
                  },
                },
              },
            },
          ],
          deletedAt: null,
        },
        include: { profile: true },
      });

      const vitals = await this.prisma.patientVitals.findMany({
        where: {
          branch: {
            clinic: {
              tenantId,
            },
          },
        },
        include: { patient: true, takenBy: true },
      });

      const encounters = await this.prisma.patientCase.findMany({
        where: {
          branch: {
            clinic: {
              tenantId,
            },
          },
        },
        include: { patient: true, doctor: true, branch: true },
      });

      const prescriptions = await this.prisma.prescription.findMany({
        where: {
          branch: {
            clinic: {
              tenantId,
            },
          },
        },
        include: {
          patientCase: {
            include: { patient: true, doctor: true },
          },
          items: true,
        },
      });

      // 2. Map everything to FHIR and generate NDJSON string lines
      const lines: string[] = [];

      patients.forEach((p) => {
        const fhir = this.mapper.mapPatientToFhir(p, tenantId);
        if (fhir) lines.push(JSON.stringify(fhir));
      });

      vitals.forEach((v) => {
        const fhir = this.mapper.mapVitalsToObservation(v, tenantId);
        if (fhir) lines.push(JSON.stringify(fhir));
      });

      encounters.forEach((e) => {
        const fhir = this.mapper.mapEncounterToFhir(e, tenantId);
        if (fhir) lines.push(JSON.stringify(fhir));
      });

      prescriptions.forEach((rx) => {
        const requests = this.mapper.mapPrescriptionToMedicationRequest(rx, tenantId);
        requests.forEach((req) => {
          lines.push(JSON.stringify(req));
        });
      });

      const ndjson = lines.join('\n');

      // 3. Save to storage location
      const exportDir = path.join(process.cwd(), 'public', 'exports');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      const fileName = `export-${tenantId}-${jobId}.ndjson`;
      const filePath = path.join(exportDir, fileName);
      fs.writeFileSync(filePath, ndjson);

      const fileUrl = `http://medflow.org/exports/${fileName}`;
      const fileSize = Buffer.byteLength(ndjson);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

      // 4. Update database job entry to COMPLETED
      await this.prisma.exportJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          fileUrl,
          fileSize,
          expiresAt,
        },
      });

      this.logger.log(`Completed FHIR Bulk Export successfully. File size: ${fileSize} bytes`);
      this.telemetryService.recordBulkExportDuration(Date.now() - startTime);
      return { fileUrl, fileSize };
    } catch (err: any) {
      this.logger.error(`FHIR Bulk Export Job ID: ${jobId} failed with error: ${err.message}`, err.stack);
      
      await this.prisma.exportJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          error: err.message || 'Unknown internal processing error',
        },
      });

      throw err;
    }
  }
}
