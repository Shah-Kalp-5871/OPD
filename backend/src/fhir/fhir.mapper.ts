import { Injectable } from '@nestjs/common';

@Injectable()
export class FhirMapper {
  /**
   * Maps internal Patient and PatientProfile to HL7 FHIR R4 Patient Resource
   */
  mapPatientToFhir(patient: any): any {
    if (!patient) return null;

    const profile = patient.profile || {};
    const fhirPatient: any = {
      resourceType: 'Patient',
      id: patient.id,
      meta: {
        versionId: '1',
        lastUpdated: patient.updatedAt.toISOString(),
      },
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
          value: patient.mrdNumber,
        },
      ],
      active: patient.isActive,
      name: [
        {
          use: 'official',
          family: patient.lastName,
          given: [patient.firstName, patient.middleName].filter(Boolean),
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: patient.mobile,
          use: 'mobile',
        },
      ],
      gender: this.mapGender(patient.genderEnum || patient.gender),
      birthDate: profile.dob ? profile.dob.toISOString().split('T')[0] : undefined,
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

    // Add blood group as standard FHIR extension if present
    if (profile.bloodGroup) {
      fhirPatient.extension.push({
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

    // Emergency Contact
    if (profile.emergencyContactName || profile.emergencyContactNo) {
      fhirPatient.contact = [
        {
          relationship: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
                  code: 'C',
                  display: 'Emergency Contact',
                },
              ],
            },
          ],
          name: {
            text: profile.emergencyContactName || 'Unnamed Contact',
          },
          telecom: profile.emergencyContactNo
            ? [
                {
                  system: 'phone',
                  value: profile.emergencyContactNo,
                },
              ]
            : undefined,
        },
      ];
    }

    return fhirPatient;
  }

  /**
   * Maps PatientCase to HL7 FHIR R4 Encounter Resource
   */
  mapEncounterToFhir(patientCase: any): any {
    if (!patientCase) return null;

    const fhirEncounter: any = {
      resourceType: 'Encounter',
      id: patientCase.id,
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
              type: [
                {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                      code: 'PPRF',
                      display: 'primary performer',
                    },
                  ],
                },
              ],
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
        start: patientCase.checkInTime ? patientCase.checkInTime.toISOString() : patientCase.createdAt.toISOString(),
        end: patientCase.closeTime ? patientCase.closeTime.toISOString() : undefined,
      },
      reasonCode: patientCase.complaint
        ? [
            {
              text: patientCase.complaint,
            },
          ]
        : undefined,
      serviceProvider: {
        reference: `Organization/${patientCase.branchId}`,
        display: patientCase.branch ? patientCase.branch.name : undefined,
      },
    };

    return fhirEncounter;
  }

  /**
   * Maps PatientVitals to HL7 FHIR R4 Observation Resource (LOINC Panel)
   */
  mapVitalsToObservation(vitals: any): any {
    if (!vitals) return null;

    const fhirObservation: any = {
      resourceType: 'Observation',
      id: vitals.id,
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
      encounter: vitals.caseId
        ? {
            reference: `Encounter/${vitals.caseId}`,
          }
        : undefined,
      effectiveDateTime: vitals.takenAt ? vitals.takenAt.toISOString() : vitals.createdAt.toISOString(),
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

    // Add component values with international LOINC codes
    if (vitals.height) {
      fhirObservation.component.push({
        code: {
          coding: [{ system: 'http://loinc.org', code: '8302-2', display: 'Body Height' }],
        },
        valueQuantity: {
          value: vitals.height,
          unit: 'cm',
          system: 'http://unitsofmeasure.org',
          code: 'cm',
        },
      });
    }

    if (vitals.weight) {
      fhirObservation.component.push({
        code: {
          coding: [{ system: 'http://loinc.org', code: '29463-7', display: 'Body Weight' }],
        },
        valueQuantity: {
          value: vitals.weight,
          unit: 'kg',
          system: 'http://unitsofmeasure.org',
          code: 'kg',
        },
      });
    }

    if (vitals.temperature) {
      fhirObservation.component.push({
        code: {
          coding: [{ system: 'http://loinc.org', code: '8310-5', display: 'Body Temperature' }],
        },
        valueQuantity: {
          value: vitals.temperature,
          unit: 'C',
          system: 'http://unitsofmeasure.org',
          code: 'Cel',
        },
      });
    }

    if (vitals.pulse) {
      fhirObservation.component.push({
        code: {
          coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart Rate' }],
        },
        valueQuantity: {
          value: vitals.pulse,
          unit: 'beats/min',
          system: 'http://unitsofmeasure.org',
          code: '/min',
        },
      });
    }

    if (vitals.spo2) {
      fhirObservation.component.push({
        code: {
          coding: [{ system: 'http://loinc.org', code: '2708-6', display: 'Oxygen Saturation' }],
        },
        valueQuantity: {
          value: vitals.spo2,
          unit: '%',
          system: 'http://unitsofmeasure.org',
          code: '%',
        },
      });
    }

    // Split blood pressure into Systolic & Diastolic components
    if (vitals.bloodPressure) {
      const parts = vitals.bloodPressure.split('/');
      if (parts.length === 2) {
        const systolic = parseInt(parts[0], 10);
        const diastolic = parseInt(parts[1], 10);

        if (!isNaN(systolic)) {
          fhirObservation.component.push({
            code: {
              coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic Blood Pressure' }],
            },
            valueQuantity: {
              value: systolic,
              unit: 'mmHg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          });
        }

        if (!isNaN(diastolic)) {
          fhirObservation.component.push({
            code: {
              coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic Blood Pressure' }],
            },
            valueQuantity: {
              value: diastolic,
              unit: 'mmHg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          });
        }
      }
    }

    return fhirObservation;
  }

  /**
   * Maps Prescription & Items to HL7 FHIR R4 MedicationRequest Resource
   */
  mapPrescriptionToMedicationRequest(prescription: any): any {
    if (!prescription) return null;

    const caseObj = prescription.patientCase || {};
    const patientObj = caseObj.patient || {};
    const doctorObj = caseObj.doctor || {};

    // A single MedFlow Prescription can house multiple items. FHIR represents each item as a separate MedicationRequest.
    const items = prescription.items || [];
    return items.map((item: any) => ({
      resourceType: 'MedicationRequest',
      id: `${prescription.id}-${item.id}`,
      status: this.mapPrescriptionStatus(prescription.status),
      intent: 'order',
      medicationCodeableConcept: {
        coding: [
          {
            system: 'http://medflow.org/fhir/codesystem/drugs',
            code: item.drugId,
            display: item.drugName || (item.drug ? item.drug.drugName : 'Medication'),
          },
        ],
        text: item.drugName || (item.drug ? item.drug.drugName : 'Medication'),
      },
      subject: {
        reference: `Patient/${caseObj.patientId || ''}`,
        display: caseObj.patient
          ? `${patientObj.firstName} ${patientObj.lastName}`
          : undefined,
      },
      encounter: prescription.caseId
        ? {
            reference: `Encounter/${prescription.caseId}`,
          }
        : undefined,
      authoredOn: prescription.createdAt.toISOString(),
      requester: caseObj.doctorId
        ? {
            reference: `Practitioner/${caseObj.doctorId}`,
            display: caseObj.doctor
              ? `Dr. ${doctorObj.firstName} ${doctorObj.lastName}`
              : undefined,
          }
        : undefined,
      dosageInstruction: [
        {
          text: `${item.dosage || 'As directed'} - ${item.frequency || '1x daily'} for ${item.duration || '1 day'}`,
          timing: {
            code: {
              text: item.frequency || '1x daily',
            },
          },
          route: {
            text: item.route || 'Oral',
          },
        },
      ],
    }));
  }

  /**
   * Maps Appointment to HL7 FHIR R4 Appointment Resource
   */
  mapAppointmentToFhir(appointment: any): any {
    if (!appointment) return null;

    const fhirAppointment: any = {
      resourceType: 'Appointment',
      id: appointment.id,
      status: this.mapAppointmentStatus(appointment.status),
      description: appointment.reason || 'OPD Consultation Appointment',
      start: appointment.appointmentDate.toISOString(),
      end: new Date(appointment.appointmentDate.getTime() + 15 * 60 * 1000).toISOString(), // 15 mins block
      created: appointment.createdAt.toISOString(),
      participant: [
        {
          actor: {
            reference: `Patient/${appointment.patientId}`,
            display: appointment.patient
              ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
              : undefined,
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
          display: appointment.doctor
            ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
            : undefined,
        },
        status: 'accepted',
        required: 'required',
      });
    }

    return fhirAppointment;
  }

  // --- Internal Helper Mappers ---

  private mapGender(gender: string): string {
    if (!gender) return 'unknown';
    const normalized = gender.toLowerCase();
    if (normalized === 'male' || normalized === 'm') return 'male';
    if (normalized === 'female' || normalized === 'f') return 'female';
    if (normalized === 'other' || normalized === 'o') return 'other';
    return 'unknown';
  }

  private mapEncounterStatus(status: string): string {
    if (!status) return 'unknown';
    const normalized = status.toLowerCase();
    if (normalized === 'open' || normalized === 'scheduled') return 'in-progress';
    if (normalized === 'closed' || normalized === 'completed') return 'finished';
    if (normalized === 'cancelled') return 'cancelled';
    return 'unknown';
  }

  private mapPrescriptionStatus(status: string): string {
    if (!status) return 'unknown';
    const normalized = status.toLowerCase();
    if (normalized === 'draft') return 'draft';
    if (normalized === 'active' || normalized === 'finalized') return 'active';
    if (normalized === 'completed') return 'completed';
    if (normalized === 'cancelled') return 'cancelled';
    return 'unknown';
  }

  private mapAppointmentStatus(status: string): string {
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
