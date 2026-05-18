import { Injectable } from '@nestjs/common';
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
} from '../resources/fhir.types';

@Injectable()
export class FhirMapper {
  /**
   * Appends multi-tenant resource metadata tag block
   */
  private createMeta(resourceType: string, version: string, lastUpdated: Date, tenantId: string) {
    return {
      versionId: version,
      lastUpdated: lastUpdated.toISOString(),
      source: `http://medflow.org/tenant/${tenantId}`,
      tag: [
        {
          system: 'http://medflow.org/fhir/tag/tenant',
          code: tenantId,
          display: `Tenant Organization ID: ${tenantId}`,
        },
      ],
    };
  }

  /**
   * Maps internal Patient to HL7 FHIR R4 Patient Resource
   */
  mapPatientToFhir(patient: any, tenantId: string): FhirPatient | null {
    if (!patient) return null;

    const profile = patient.profile || {};
    const fhirPatient: FhirPatient = {
      resourceType: 'Patient',
      id: patient.id,
      meta: this.createMeta('Patient', '1', patient.updatedAt || new Date(), tenantId),
      identifier: [
        {
          use: 'official',
          type: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                code: 'MR',
                display: 'Medical Record Number',
              },
            ],
          },
          system: 'http://medflow.org/fhir/patient-mrd',
          value: patient.mrdNumber || patient.id,
        },
      ],
      active: patient.isActive !== undefined ? patient.isActive : true,
      name: [
        {
          use: 'official',
          family: patient.lastName || '',
          given: [patient.firstName, patient.middleName].filter(Boolean),
        },
      ],
      telecom: patient.mobile
        ? [
            {
              system: 'phone',
              value: patient.mobile,
              use: 'mobile',
            },
          ]
        : [],
      gender: this.mapGender(patient.genderEnum || patient.gender),
      birthDate: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : undefined,
      address: profile.address
        ? [
            {
              use: 'home',
              line: [profile.address],
              city: profile.city || undefined,
              state: profile.state || undefined,
            },
          ]
        : undefined,
      extension: [],
    };

    // Add blood group
    if (profile.bloodGroup) {
      fhirPatient.extension?.push({
        url: 'http://hl7.org/fhir/StructureDefinition/patient-bloodGroup',
        valueCodeableConcept: {
          coding: [
            {
              system: 'http://medflow.org/fhir/codesystem/bloodgroup',
              code: profile.bloodGroup,
              display: `Blood Group ${profile.bloodGroup}`,
            },
          ],
        },
      });
    }

    return fhirPatient;
  }

  /**
   * Maps internal Doctor/User to HL7 FHIR R4 Practitioner Resource
   */
  mapPractitionerToFhir(user: any, tenantId: string): FhirPractitioner | null {
    if (!user) return null;

    return {
      resourceType: 'Practitioner',
      id: user.id,
      meta: this.createMeta('Practitioner', '1', user.updatedAt || new Date(), tenantId),
      identifier: [
        {
          use: 'official',
          system: 'http://medflow.org/fhir/practitioner-id',
          value: user.id,
        },
      ],
      active: user.isActive !== undefined ? user.isActive : true,
      name: [
        {
          family: user.lastName || '',
          given: [user.firstName].filter(Boolean),
          prefix: ['Dr.'],
        },
      ],
      telecom: user.mobile
        ? [
            {
              system: 'phone',
              value: user.mobile,
              use: 'work',
            },
          ]
        : [],
    };
  }

  /**
   * Maps PatientCase to HL7 FHIR R4 Encounter Resource
   */
  mapEncounterToFhir(patientCase: any, tenantId: string): FhirEncounter | null {
    if (!patientCase) return null;

    return {
      resourceType: 'Encounter',
      id: patientCase.id,
      meta: this.createMeta('Encounter', '1', patientCase.updatedAt || new Date(), tenantId),
      status: this.mapEncounterStatus(patientCase.status),
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'ambulatory',
      },
      subject: {
        reference: `Patient/${patientCase.patientId}`,
        display: patientCase.patient
          ? `${patientCase.patient.firstName} ${patientCase.patient.lastName}`
          : undefined,
      },
      participant: patientCase.doctorId
        ? [
            {
              individual: {
                reference: `Practitioner/${patientCase.doctorId}`,
                display: patientCase.doctor
                  ? `Dr. ${patientCase.doctor.firstName} ${patientCase.doctor.lastName}`
                  : undefined,
              },
            },
          ]
        : undefined,
      period: {
        start: patientCase.checkInTime ? new Date(patientCase.checkInTime).toISOString() : patientCase.createdAt.toISOString(),
        end: patientCase.closeTime ? new Date(patientCase.closeTime).toISOString() : undefined,
      },
      reasonCode: patientCase.complaint
        ? [
            {
              text: patientCase.complaint,
            },
          ]
        : undefined,
      serviceProvider: {
        reference: `Organization/${patientCase.branchId || 'default-branch'}`,
        display: patientCase.branch ? patientCase.branch.name : undefined,
      },
    };
  }

  /**
   * Maps PatientVitals to HL7 FHIR R4 Observation Resource (LOINC Panel)
   */
  mapVitalsToObservation(vitals: any, tenantId: string): FhirObservation | null {
    if (!vitals) return null;

    const fhirObservation: FhirObservation = {
      resourceType: 'Observation',
      id: vitals.id,
      meta: this.createMeta('Observation', '1', vitals.updatedAt || new Date(), tenantId),
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '8716-3',
            display: 'Vital signs codes list',
          },
        ],
        text: 'Patient Vitals signs panel',
      },
      subject: {
        reference: `Patient/${vitals.patientId}`,
        display: vitals.patient
          ? `${vitals.patient.firstName} ${vitals.patient.lastName}`
          : undefined,
      },
      encounter: vitals.caseId ? { reference: `Encounter/${vitals.caseId}` } : undefined,
      effectiveDateTime: vitals.takenAt ? new Date(vitals.takenAt).toISOString() : vitals.createdAt.toISOString(),
      performer: vitals.takenById
        ? [
            {
              reference: `Practitioner/${vitals.takenById}`,
              display: vitals.takenBy ? `${vitals.takenBy.firstName} ${vitals.takenBy.lastName}` : undefined,
            },
          ]
        : undefined,
      component: [],
    };

    // Components
    if (vitals.height) {
      fhirObservation.component?.push({
        code: { coding: [{ system: 'http://loinc.org', code: '8302-2', display: 'Body Height' }] },
        valueQuantity: { value: Number(vitals.height), unit: 'cm', system: 'http://unitsofmeasure.org', code: 'cm' },
      });
    }

    if (vitals.weight) {
      fhirObservation.component?.push({
        code: { coding: [{ system: 'http://loinc.org', code: '29463-7', display: 'Body Weight' }] },
        valueQuantity: { value: Number(vitals.weight), unit: 'kg', system: 'http://unitsofmeasure.org', code: 'kg' },
      });
    }

    if (vitals.temperature) {
      fhirObservation.component?.push({
        code: { coding: [{ system: 'http://loinc.org', code: '8310-5', display: 'Body Temperature' }] },
        valueQuantity: { value: Number(vitals.temperature), unit: 'C', system: 'http://unitsofmeasure.org', code: 'Cel' },
      });
    }

    if (vitals.pulse) {
      fhirObservation.component?.push({
        code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart Rate' }] },
        valueQuantity: { value: Number(vitals.pulse), unit: 'beats/min', system: 'http://unitsofmeasure.org', code: '/min' },
      });
    }

    if (vitals.spo2) {
      fhirObservation.component?.push({
        code: { coding: [{ system: 'http://loinc.org', code: '2708-6', display: 'Oxygen Saturation' }] },
        valueQuantity: { value: Number(vitals.spo2), unit: '%', system: 'http://unitsofmeasure.org', code: '%' },
      });
    }

    return fhirObservation;
  }

  /**
   * Maps Prescription to HL7 FHIR R4 MedicationRequest list (one request per item)
   */
  mapPrescriptionToMedicationRequest(prescription: any, tenantId: string): FhirMedicationRequest[] {
    if (!prescription) return [];

    const caseObj = prescription.patientCase || {};
    const patientObj = caseObj.patient || {};
    const doctorObj = caseObj.doctor || {};
    const items = prescription.items || [];

    return items.map((item: any) => ({
      resourceType: 'MedicationRequest',
      id: `${prescription.id}-${item.id}`,
      meta: this.createMeta('MedicationRequest', '1', prescription.updatedAt || new Date(), tenantId),
      status: this.mapPrescriptionStatus(prescription.status),
      intent: 'order',
      medicationCodeableConcept: {
        coding: [
          {
            system: 'http://medflow.org/fhir/codesystem/drugs',
            code: item.drugId || 'unknown',
            display: item.drugName || 'Medication',
          },
        ],
        text: item.drugName || 'Medication',
      },
      subject: {
        reference: `Patient/${caseObj.patientId || ''}`,
        display: caseObj.patient ? `${patientObj.firstName} ${patientObj.lastName}` : undefined,
      },
      encounter: prescription.caseId ? { reference: `Encounter/${prescription.caseId}` } : undefined,
      authoredOn: prescription.createdAt.toISOString(),
      requester: caseObj.doctorId
        ? {
            reference: `Practitioner/${caseObj.doctorId}`,
            display: caseObj.doctor ? `Dr. ${doctorObj.firstName} ${doctorObj.lastName}` : undefined,
          }
        : undefined,
      dosageInstruction: [
        {
          text: `${item.dosage || 'As directed'} - ${item.frequency || '1x daily'} for ${item.duration || '1 day'}`,
          timing: { code: { text: item.frequency || '1x daily' } },
          route: { text: item.route || 'Oral' },
        },
      ],
    }));
  }

  /**
   * Maps Appointment to HL7 FHIR R4 Appointment Resource
   */
  mapAppointmentToFhir(appointment: any, tenantId: string): FhirAppointment | null {
    if (!appointment) return null;

    const fhirAppointment: FhirAppointment = {
      resourceType: 'Appointment',
      id: appointment.id,
      meta: this.createMeta('Appointment', '1', appointment.updatedAt || new Date(), tenantId),
      status: this.mapAppointmentStatus(appointment.status),
      description: appointment.reason || 'OPD Consultation Appointment',
      start: appointment.appointmentDate.toISOString(),
      end: new Date(appointment.appointmentDate.getTime() + 15 * 60 * 1000).toISOString(),
      created: appointment.createdAt.toISOString(),
      participant: [
        {
          actor: {
            reference: `Patient/${appointment.patientId}`,
            display: appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : undefined,
          },
          status: 'accepted',
          required: 'required',
        },
      ],
    };

    if (appointment.doctorId) {
      fhirAppointment.participant.push({
        actor: {
          reference: `Practitioner/${appointment.doctorId}`,
          display: appointment.doctor ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}` : undefined,
        },
        status: 'accepted',
        required: 'required',
      });
    }

    return fhirAppointment;
  }

  /**
   * Maps internal Doctor Consultation Diagnosis to HL7 FHIR Condition
   */
  mapConditionToFhir(caseObj: any, tenantId: string): FhirCondition | null {
    if (!caseObj) return null;

    return {
      resourceType: 'Condition',
      id: caseObj.id,
      meta: this.createMeta('Condition', '1', caseObj.updatedAt || new Date(), tenantId),
      clinicalStatus: {
        coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }],
      },
      verificationStatus: {
        coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }],
      },
      code: {
        coding: [
          {
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: caseObj.diagnosisCode || 'R69',
            display: caseObj.diagnosis || 'Illness, unspecified',
          },
        ],
        text: caseObj.diagnosis || 'Illness, unspecified',
      },
      subject: {
        reference: `Patient/${caseObj.patientId}`,
        display: caseObj.patient ? `${caseObj.patient.firstName} ${caseObj.patient.lastName}` : undefined,
      },
      encounter: { reference: `Encounter/${caseObj.id}` },
      recordedDate: caseObj.createdAt.toISOString(),
    };
  }

  /**
   * Maps Diagnostic/Lab records to HL7 FHIR DiagnosticReport
   */
  mapDiagnosticReportToFhir(labRecord: any, tenantId: string): FhirDiagnosticReport | null {
    if (!labRecord) return null;

    return {
      resourceType: 'DiagnosticReport',
      id: labRecord.id,
      meta: this.createMeta('DiagnosticReport', '1', labRecord.updatedAt || new Date(), tenantId),
      status: 'final',
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: labRecord.testCode || '24331-1',
            display: labRecord.testName || 'Lab Investigation Panel',
          },
        ],
        text: labRecord.testName || 'Lab Investigation Panel',
      },
      subject: {
        reference: `Patient/${labRecord.patientId}`,
      },
      encounter: labRecord.caseId ? { reference: `Encounter/${labRecord.caseId}` } : undefined,
      effectiveDateTime: labRecord.createdAt.toISOString(),
      issued: labRecord.updatedAt ? labRecord.updatedAt.toISOString() : labRecord.createdAt.toISOString(),
      conclusion: labRecord.findings || 'Normal results',
    };
  }

  /**
   * Maps Allergy entries to HL7 FHIR AllergyIntolerance Resource
   */
  mapAllergyIntoleranceToFhir(allergy: any, tenantId: string): FhirAllergyIntolerance | null {
    if (!allergy) return null;

    return {
      resourceType: 'AllergyIntolerance',
      id: allergy.id,
      meta: this.createMeta('AllergyIntolerance', '1', allergy.updatedAt || new Date(), tenantId),
      clinicalStatus: {
        coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active', display: 'Active' }],
      },
      verificationStatus: {
        coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', code: 'confirmed', display: 'Confirmed' }],
      },
      type: 'allergy',
      category: ['medication'],
      criticality: 'high',
      code: {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: allergy.allergyCode || '387406002',
            display: allergy.substance || 'Sulfonamide',
          },
        ],
        text: allergy.substance || 'Sulfonamide',
      },
      patient: {
        reference: `Patient/${allergy.patientId}`,
      },
      recordedDate: allergy.createdAt.toISOString(),
    };
  }

  // --- Helpers ---
  private mapGender(gender: string): 'male' | 'female' | 'other' | 'unknown' {
    if (!gender) return 'unknown';
    const normalized = gender.toLowerCase();
    if (normalized === 'male' || normalized === 'm') return 'male';
    if (normalized === 'female' || normalized === 'f') return 'female';
    if (normalized === 'other' || normalized === 'o') return 'other';
    return 'unknown';
  }

  private mapEncounterStatus(status: string): 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled' | 'entered-in-error' | 'unknown' {
    if (!status) return 'unknown';
    const normalized = status.toLowerCase();
    if (normalized === 'open' || normalized === 'scheduled') return 'in-progress';
    if (normalized === 'closed' || normalized === 'completed') return 'finished';
    if (normalized === 'cancelled') return 'cancelled';
    return 'unknown';
  }

  private mapPrescriptionStatus(status: string): 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown' {
    if (!status) return 'unknown';
    const normalized = status.toLowerCase();
    if (normalized === 'draft') return 'draft';
    if (normalized === 'active' || normalized === 'finalized') return 'active';
    if (normalized === 'completed') return 'completed';
    if (normalized === 'cancelled') return 'cancelled';
    return 'unknown';
  }

  private mapAppointmentStatus(status: string): 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'entered-in-error' {
    if (!status) return 'proposed';
    const normalized = status.toLowerCase();
    if (normalized === 'scheduled') return 'booked';
    if (normalized === 'checked_in') return 'arrived';
    if (normalized === 'completed') return 'fulfilled';
    if (normalized === 'cancelled') return 'cancelled';
    if (normalized === 'no_show') return 'noshow';
    return 'proposed';
  }
}
