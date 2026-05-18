import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FhirMapper } from './fhir.mapper';

@Injectable()
export class FhirService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FhirMapper,
  ) {}

  /**
   * Fetch single patient FHIR resource by ID
   */
  async getPatientFhir(id: string): Promise<any> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        profile: true,
        addresses: true,
      },
    });

    if (!patient || patient.deletedAt) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return this.mapper.mapPatientToFhir(patient);
  }

  /**
   * Search patients and return FHIR Bundle
   */
  async searchPatientsFhir(query: { name?: string; mobile?: string; mrd?: string }): Promise<any> {
    const whereClause: any = { deletedAt: null };

    if (query.mrd) {
      whereClause.mrdNumber = { contains: query.mrd, mode: 'insensitive' };
    }
    if (query.mobile) {
      whereClause.mobile = { contains: query.mobile };
    }
    if (query.name) {
      whereClause.OR = [
        { firstName: { contains: query.name, mode: 'insensitive' } },
        { lastName: { contains: query.name, mode: 'insensitive' } },
      ];
    }

    const patients = await this.prisma.patient.findMany({
      where: whereClause,
      include: {
        profile: true,
        addresses: true,
      },
      take: 50,
    });

    const entries = patients.map((patient) => ({
      fullUrl: `http://medflow.org/fhir/Patient/${patient.id}`,
      resource: this.mapper.mapPatientToFhir(patient),
      search: { mode: 'match' },
    }));

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: patients.length,
      entry: entries,
    };
  }

  /**
   * Fetch single Encounter FHIR resource by ID
   */
  async getEncounterFhir(id: string): Promise<any> {
    const patientCase = await this.prisma.patientCase.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        branch: true,
      },
    });

    if (!patientCase) {
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }

    return this.mapper.mapEncounterToFhir(patientCase);
  }

  /**
   * Fetch Observation list as standard FHIR Bundle
   */
  async getObservationsFhir(patientId?: string, caseId?: string): Promise<any> {
    const whereClause: any = {};
    if (patientId) whereClause.patientId = patientId;
    if (caseId) whereClause.caseId = caseId;

    const vitalsList = await this.prisma.patientVitals.findMany({
      where: whereClause,
      include: {
        patient: true,
        takenBy: true,
      },
      orderBy: { takenAt: 'desc' },
    });

    const entries = vitalsList.map((vitals) => ({
      fullUrl: `http://medflow.org/fhir/Observation/${vitals.id}`,
      resource: this.mapper.mapVitalsToObservation(vitals),
    }));

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: vitalsList.length,
      entry: entries,
    };
  }

  /**
   * Fetch MedicationRequest list as FHIR Bundle
   */
  async getMedicationRequestsFhir(patientId?: string, caseId?: string): Promise<any> {
    const whereClause: any = {};
    if (patientId) whereClause.patientCase = { patientId };
    if (caseId) whereClause.caseId = caseId;

    const prescriptions = await this.prisma.prescription.findMany({
      where: whereClause,
      include: {
        patientCase: {
          include: {
            patient: true,
            doctor: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Each internal prescription can map to multiple MedicationRequest resources (one per item)
    const allRequests: any[] = [];
    prescriptions.forEach((rx) => {
      const requests = this.mapper.mapPrescriptionToMedicationRequest(rx);
      if (Array.isArray(requests)) {
        requests.forEach((req) => {
          allRequests.push({
            fullUrl: `http://medflow.org/fhir/MedicationRequest/${req.id}`,
            resource: req,
          });
        });
      }
    });

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: allRequests.length,
      entry: allRequests,
    };
  }

  /**
   * Fetch single Appointment FHIR resource by ID
   */
  async getAppointmentFhir(id: string): Promise<any> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return this.mapper.mapAppointmentToFhir(appointment);
  }
}
