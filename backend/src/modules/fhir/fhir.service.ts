import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { FhirMapper } from './mappers/fhir.mapper';
import { FhirValidator } from './validators/fhir.validator';
import {
  FhirPatient,
  FhirPractitioner,
  FhirEncounter,
  FhirObservation,
  FhirMedicationRequest,
  FhirAppointment,
  FhirCondition,
  FhirDiagnosticReport,
  FhirAllergyIntolerance,
} from './resources/fhir.types';
import { TelemetryService } from '../../metrics/telemetry.service';

@Injectable()
export class FhirService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FhirMapper,
    private readonly telemetryService: TelemetryService,
    @InjectQueue('fhir-export') private readonly exportQueue: Queue,
  ) {}

  /**
   * Generates dynamic SMART-on-FHIR R4 CapabilityStatement (metadata)
   */
  async getCapabilityStatement(): Promise<any> {
    return {
      resourceType: 'CapabilityStatement',
      id: 'medflow-fhir-capability',
      status: 'active',
      date: new Date().toISOString(),
      publisher: 'MedFlow EMR Inc.',
      kind: 'instance',
      software: {
        name: 'MedFlow OPD FHIR Server',
        version: '2.0.0-R4',
      },
      implementation: {
        description: 'Multi-Tenant SMART-on-FHIR R4 compliant endpoint',
        url: 'http://medflow.org/api/v2/fhir',
      },
      fhirVersion: '4.0.1',
      format: ['application/fhir+json', 'application/json'],
      rest: [
        {
          mode: 'server',
          security: {
            cors: true,
            service: [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/restful-security-service',
                    code: 'SMART-on-FHIR',
                    display: 'SMART-on-FHIR',
                  },
                ],
                text: 'SMART-on-FHIR access controls enabled',
              },
            ],
          },
          resource: [
            {
              type: 'Patient',
              interaction: [{ code: 'read' }, { code: 'create' }, { code: 'update' }, { code: 'search-type' }],
              searchParam: [{ name: 'name', type: 'string' }, { name: 'mobile', type: 'string' }, { name: 'mrd', type: 'string' }],
            },
            {
              type: 'Observation',
              interaction: [{ code: 'read' }, { code: 'create' }, { code: 'search-type' }],
              searchParam: [{ name: 'patient', type: 'reference' }, { name: 'encounter', type: 'reference' }],
            },
            {
              type: 'Encounter',
              interaction: [{ code: 'read' }],
            },
            {
              type: 'MedicationRequest',
              interaction: [{ code: 'read' }, { code: 'search-type' }],
            },
            {
              type: 'Appointment',
              interaction: [{ code: 'read' }],
            },
          ],
        },
      ],
    };
  }

  /**
   * Fetch single Patient by ID with tenant validation and active soft delete support
   */
  async getPatientFhir(id: string, tenantId: string): Promise<FhirPatient> {
    this.telemetryService.incrementFhirRequests();
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!patient || patient.deletedAt) {
      throw new NotFoundException(`Patient with ID "${id}" not found`);
    }

    const isPatientInTenant = await this.prisma.patient.findFirst({
      where: {
        id,
        deletedAt: null,
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
      },
    });

    if (!isPatientInTenant) {
      throw new ForbiddenException('Resource tenant isolation violation');
    }

    const mapped = this.mapper.mapPatientToFhir(patient, tenantId);
    if (!mapped) {
      throw new NotFoundException(`Patient with ID "${id}" could not be mapped to FHIR`);
    }
    return mapped;
  }

  /**
   * Search patients based on name, mobile, or MRD number
   */
  async searchPatientsFhir(
    params: { name?: string; mobile?: string; mrd?: string },
    tenantId: string,
  ): Promise<any> {
    this.telemetryService.incrementFhirRequests();
    const whereClause: any = {
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
    };

    if (params.name) {
      whereClause.OR = [
        { firstName: { contains: params.name, mode: 'insensitive' } },
        { lastName: { contains: params.name, mode: 'insensitive' } },
      ];
    }

    if (params.mobile) {
      whereClause.mobile = { contains: params.mobile };
    }

    if (params.mrd) {
      whereClause.mrdNumber = { contains: params.mrd };
    }

    const patients = await this.prisma.patient.findMany({
      where: whereClause,
      include: { profile: true },
      take: 50,
    });

    const entries = patients.map((p) => {
      const mapped = this.mapper.mapPatientToFhir(p, tenantId);
      return {
        fullUrl: `http://medflow.org/api/v2/fhir/Patient/${p.id}`,
        resource: mapped,
      };
    }).filter((entry) => entry.resource !== null);

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: entries.length,
      entry: entries,
    };
  }

  /**
   * Ingest/Create new Patient resource
   */
  async createPatientFhir(payload: any, tenantId: string): Promise<FhirPatient> {
    this.telemetryService.incrementFhirRequests();
    try {
      FhirValidator.validatePatient(payload);
    } catch (err) {
      this.telemetryService.incrementFhirValidationFailures();
      throw err;
    }

    const family = payload.name?.[0]?.family || '';
    const given = payload.name?.[0]?.given?.[0] || '';
    const mobile = payload.telecom?.find((t: any) => t.system === 'phone')?.value || null;
    const gender = payload.gender === 'male' ? 'MALE' : payload.gender === 'female' ? 'FEMALE' : 'UNKNOWN';

    const patient = await this.prisma.patient.create({
      data: {
        firstName: given,
        lastName: family,
        gender: payload.gender === 'male' ? 'Male' : payload.gender === 'female' ? 'Female' : 'Unknown',
        genderEnum: gender,
        mobile,
        mrdNumber: payload.identifier?.[0]?.value || `MRD-${Math.floor(Math.random() * 1000000)}`,
        profile: {
          create: {
            dob: payload.birthDate ? new Date(payload.birthDate) : null,
            address: payload.address?.[0]?.line?.[0] || null,
          },
        },
      },
      include: { profile: true },
    });

    const mapped = this.mapper.mapPatientToFhir(patient, tenantId);
    if (!mapped) {
      throw new BadRequestException('Patient created but could not be mapped to FHIR');
    }
    return mapped;
  }

  /**
   * Update existing Patient profile
   */
  async updatePatientFhir(id: string, payload: any, tenantId: string): Promise<FhirPatient> {
    this.telemetryService.incrementFhirRequests();
    try {
      FhirValidator.validatePatient(payload);
    } catch (err) {
      this.telemetryService.incrementFhirValidationFailures();
      throw err;
    }

    const existingPatient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient || existingPatient.deletedAt) {
      throw new NotFoundException(`Patient "${id}" not found`);
    }

    const isPatientInTenant = await this.prisma.patient.findFirst({
      where: {
        id,
        deletedAt: null,
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
      },
    });

    if (!isPatientInTenant) {
      throw new ForbiddenException('Tenant access mismatch');
    }

    const family = payload.name?.[0]?.family || existingPatient.lastName;
    const given = payload.name?.[0]?.given?.[0] || existingPatient.firstName;
    const mobile = payload.telecom?.find((t: any) => t.system === 'phone')?.value || existingPatient.mobile;

    const updated = await this.prisma.patient.update({
      where: { id },
      data: {
        firstName: given,
        lastName: family,
        mobile,
        profile: {
          update: {
            dob: payload.birthDate ? new Date(payload.birthDate) : undefined,
            address: payload.address?.[0]?.line?.[0] || undefined,
          },
        },
      },
      include: { profile: true },
    });

    const mapped = this.mapper.mapPatientToFhir(updated, tenantId);
    if (!mapped) {
      throw new BadRequestException('Patient updated but could not be mapped to FHIR');
    }
    return mapped;
  }

  /**
   * Retrieve clinical Encounter mapping PatientCase
   */
  async getEncounterFhir(id: string, tenantId: string): Promise<FhirEncounter> {
    this.telemetryService.incrementFhirRequests();
    const patientCase = await this.prisma.patientCase.findFirst({
      where: {
        id,
        branch: {
          clinic: {
            tenantId,
          },
        },
      },
      include: { patient: true, doctor: true, branch: true },
    });

    if (!patientCase) {
      throw new NotFoundException(`Encounter with ID "${id}" not found`);
    }

    const mapped = this.mapper.mapEncounterToFhir(patientCase, tenantId);
    if (!mapped) {
      throw new NotFoundException(`Encounter with ID "${id}" could not be mapped to FHIR`);
    }
    return mapped;
  }

  /**
   * Search vital signs observations
   */
  async getObservationsFhir(patientId: string, caseId: string, tenantId: string): Promise<any> {
    this.telemetryService.incrementFhirRequests();
    const whereClause: any = {
      branch: {
        clinic: {
          tenantId,
        },
      },
    };
    if (patientId) whereClause.patientId = patientId;
    if (caseId) whereClause.caseId = caseId;

    const vitals = await this.prisma.patientVitals.findMany({
      where: whereClause,
      include: { patient: true, takenBy: true },
      take: 50,
    });

    const entries = vitals.map((v) => {
      const mapped = this.mapper.mapVitalsToObservation(v, tenantId);
      return {
        fullUrl: `http://medflow.org/api/v2/fhir/Observation/${v.id}`,
        resource: mapped,
      };
    }).filter((entry) => entry.resource !== null);

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: entries.length,
      entry: entries,
    };
  }

  /**
   * Ingest Observation resources (vitals)
   */
  async createObservationFhir(payload: any, tenantId: string): Promise<FhirObservation> {
    this.telemetryService.incrementFhirRequests();
    try {
      FhirValidator.validateObservation(payload);
    } catch (err) {
      this.telemetryService.incrementFhirValidationFailures();
      throw err;
    }

    const patientId = payload.subject.reference.replace('Patient/', '');
    const caseId = payload.encounter?.reference?.replace('Encounter/', '') || null;

    const isPatientInTenant = await this.prisma.patient.findFirst({
      where: {
        id: patientId,
        deletedAt: null,
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
      },
    });

    if (!isPatientInTenant) {
      throw new ForbiddenException('Patient tenant mismatch or not found');
    }

    // Extract values
    let temperature: string | null = null;
    let pulse: string | null = null;
    let spo2: string | null = null;

    payload.component?.forEach((comp: any) => {
      const code = comp.code?.coding?.[0]?.code;
      const value = comp.valueQuantity?.value;
      if (code === '8310-5') temperature = String(value);
      if (code === '8867-4') pulse = String(value);
      if (code === '2708-6') spo2 = String(value);
    });

    let branchId = payload.device || null;
    if (!branchId) {
      const latestCase = await this.prisma.patientCase.findFirst({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
      });
      if (latestCase) {
        branchId = latestCase.branchId;
      }
    }
    if (!branchId) {
      const branch = await this.prisma.branch.findFirst({
        where: {
          clinic: {
            tenantId,
          },
        },
      });
      if (branch) {
        branchId = branch.id;
      }
    }
    if (!branchId) {
      throw new BadRequestException('Unable to resolve active branch isolation scope for FHIR Vital ingestion');
    }

    const vitals = await this.prisma.patientVitals.create({
      data: {
        patientId,
        caseId,
        temperature: temperature ? Number(temperature) : null,
        pulse: pulse ? Number(pulse) : null,
        spo2: spo2 ? Number(spo2) : null,
        height: 170,
        weight: 70,
        bloodPressure: '120/80',
        branchId,
        takenAt: payload.effectiveDateTime ? new Date(payload.effectiveDateTime) : new Date(),
      },
      include: { patient: true },
    });

    const mapped = this.mapper.mapVitalsToObservation(vitals, tenantId);
    if (!mapped) {
      throw new BadRequestException('Observation created but could not be mapped to FHIR');
    }
    return mapped;
  }

  /**
   * Search MedicationRequest lists
   */
  async getMedicationRequestsFhir(patientId: string, caseId: string, tenantId: string): Promise<any> {
    this.telemetryService.incrementFhirRequests();
    const whereClause: any = {
      branch: {
        clinic: {
          tenantId,
        },
      },
    };
    if (patientId) {
      whereClause.patientCase = { patientId };
    }
    if (caseId) {
      whereClause.caseId = caseId;
    }

    const prescriptions = await this.prisma.prescription.findMany({
      where: whereClause,
      include: {
        patientCase: {
          include: { patient: true, doctor: true },
        },
        items: true,
      },
      take: 50,
    });

    const allRequests: any[] = [];
    prescriptions.forEach((rx) => {
      const requests = this.mapper.mapPrescriptionToMedicationRequest(rx, tenantId);
      requests.forEach((req) => {
        allRequests.push({
          fullUrl: `http://medflow.org/api/v2/fhir/MedicationRequest/${req.id}`,
          resource: req,
        });
      });
    });

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: allRequests.length,
      entry: allRequests,
    };
  }

  /**
   * Retrieve Single Appointment
   */
  async getAppointmentFhir(id: string, tenantId: string): Promise<FhirAppointment> {
    this.telemetryService.incrementFhirRequests();
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id,
        branch: {
          clinic: {
            tenantId,
          },
        },
      },
      include: { patient: true, doctor: true },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID "${id}" not found`);
    }

    const mapped = this.mapper.mapAppointmentToFhir(appointment, tenantId);
    if (!mapped) {
      throw new NotFoundException(`Appointment with ID "${id}" could not be mapped to FHIR`);
    }
    return mapped;
  }

  /**
   * SMART-on-FHIR client registration and consent grant verification
   */
  async verifyConsent(patientId: string, scope: string, tenantId: string): Promise<boolean> {
    const grant = await this.prisma.consentGrant.findFirst({
      where: {
        tenantId,
        patientId,
        scopes: { has: scope },
        expiresAt: { gte: new Date() },
        deletedAt: null,
      },
    });
    return !!grant;
  }

  /**
   * Terminology concept lookup search
   */
  async searchTerminology(query: string): Promise<any> {
    const concepts = await this.prisma.terminologyConcept.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { display: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
    return concepts;
  }

  /**
   * ICD-10 unique code lookup
   */
  async lookupIcd10(code: string): Promise<any> {
    const concept = await this.prisma.terminologyConcept.findUnique({
      where: {
        system_code: {
          system: 'ICD-10',
          code,
        },
      },
    });
    if (!concept) {
      throw new NotFoundException(`ICD-10 code "${code}" not found`);
    }
    return concept;
  }

  /**
   * SMART-on-FHIR Dynamic Consent artifact creation
   */
  async createConsentArtifact(
    patientId: string,
    consentType: string,
    signatureBase64: string,
    tenantId: string,
  ): Promise<any> {
    const artifact = await this.prisma.consentArtifact.create({
      data: {
        tenantId,
        patientId,
        consentType,
        signatureBase64,
        documentHash: 'sha256-' + Math.random().toString(36).substring(7),
      },
    });
    return artifact;
  }

  /**
   * SMART-on-FHIR Dynamic Consent Grant allocation
   */
  async grantConsentScope(
    patientId: string,
    artifactId: string,
    requesterSystem: string,
    scopes: string[],
    expiresInHours: number,
    tenantId: string,
  ): Promise<any> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const grant = await this.prisma.consentGrant.create({
      data: {
        tenantId,
        patientId,
        artifactId,
        requesterSystem,
        scopes,
        expiresAt,
      },
    });
    return grant;
  }

  /**
   * SMART-on-FHIR Dynamic Consent Revocation
   */
  async revokeConsentGrant(grantId: string, revokedBy: string, reason: string, tenantId: string): Promise<any> {
    const grant = await this.prisma.consentGrant.findFirst({
      where: { id: grantId, tenantId },
    });

    if (!grant) {
      throw new NotFoundException(`Consent grant with ID "${grantId}" not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      // Create revocation entry
      const revocation = await tx.consentRevocation.create({
        data: {
          tenantId,
          grantId,
          revokedBy,
          reason,
        },
      });

      // Soft delete the grant
      await tx.consentGrant.update({
        where: { id: grantId },
        data: { deletedAt: new Date() },
      });

      return revocation;
    });
  }

  /**
   * Initiates FHIR Bulk Export ($export) job pipeline
   */
  async triggerBulkExport(tenantId: string): Promise<any> {
    const job = await this.prisma.exportJob.create({
      data: {
        tenantId,
        status: 'PENDING',
      },
    });

    // Enqueue job onto fhir-export BullMQ queue
    await this.exportQueue.add('process-bulk-export', {
      jobId: job.id,
      tenantId,
    });

    return job;
  }

  /**
   * Checks FHIR Bulk Export status
   */
  async getExportJobStatus(jobId: string, tenantId: string): Promise<any> {
    const job = await this.prisma.exportJob.findUnique({
      where: { id: jobId },
    });

    if (!job || job.deletedAt) {
      throw new NotFoundException(`Export job "${jobId}" not found`);
    }

    if (job.tenantId !== tenantId) {
      throw new ForbiddenException('Tenant access mismatch');
    }

    return job;
  }
}
