import { BadRequestException } from '@nestjs/common';

export class FhirValidator {
  /**
   * Validates a generic FHIR R4 resource against baseline requirements
   */
  static validateResource(resource: any): void {
    if (!resource || typeof resource !== 'object') {
      throw new BadRequestException('Invalid FHIR payload: must be a JSON object');
    }

    if (!resource.resourceType || typeof resource.resourceType !== 'string') {
      throw new BadRequestException('FHIR validation failure: missing string "resourceType"');
    }

    const validResourceTypes = [
      'Patient',
      'Practitioner',
      'Encounter',
      'Observation',
      'MedicationRequest',
      'Appointment',
      'Condition',
      'DiagnosticReport',
      'AllergyIntolerance',
      'Bundle',
      'CapabilityStatement',
    ];

    if (!validResourceTypes.includes(resource.resourceType)) {
      throw new BadRequestException(`FHIR validation failure: unsupported resourceType "${resource.resourceType}"`);
    }

    // Ensure meta tag block is formed correctly if provided
    if (resource.meta && typeof resource.meta !== 'object') {
      throw new BadRequestException('FHIR validation failure: "meta" must be an object');
    }
  }

  /**
   * Validates Patient FHIR resource
   */
  static validatePatient(patient: any): void {
    this.validateResource(patient);
    if (patient.resourceType !== 'Patient') {
      throw new BadRequestException('Expected Patient resourceType');
    }

    if (!patient.name || !Array.isArray(patient.name) || patient.name.length === 0) {
      throw new BadRequestException('Patient resource must include at least one "name" entry');
    }

    const name = patient.name[0];
    if (!name.family && (!name.given || name.given.length === 0)) {
      throw new BadRequestException('Patient name must contain at least a family name or given name');
    }
  }

  /**
   * Validates Observation FHIR resource
   */
  static validateObservation(observation: any): void {
    this.validateResource(observation);
    if (observation.resourceType !== 'Observation') {
      throw new BadRequestException('Expected Observation resourceType');
    }

    const allowedStatuses = ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'];
    if (!observation.status || !allowedStatuses.includes(observation.status)) {
      throw new BadRequestException(`Observation status must be one of: ${allowedStatuses.join(', ')}`);
    }

    if (!observation.code || typeof observation.code !== 'object') {
      throw new BadRequestException('Observation resource must include a valid "code" object');
    }

    if (!observation.subject || !observation.subject.reference) {
      throw new BadRequestException('Observation resource must link to a valid "subject" patient reference');
    }
  }
}
