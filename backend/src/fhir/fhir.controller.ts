import { Controller, Get, Param, Query, Header, UseGuards } from '@nestjs/common';
import { FhirService } from './fhir.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fhir')
@UseGuards(JwtAuthGuard)
export class FhirController {
  constructor(private readonly fhirService: FhirService) {}

  @Get('Patient/:id')
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async getPatient(@Param('id') id: string) {
    return this.fhirService.getPatientFhir(id);
  }

  @Get('Patient')
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async searchPatients(
    @Query('name') name?: string,
    @Query('mobile') mobile?: string,
    @Query('mrd') mrd?: string,
  ) {
    return this.fhirService.searchPatientsFhir({ name, mobile, mrd });
  }

  @Get('Encounter/:id')
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async getEncounter(@Param('id') id: string) {
    return this.fhirService.getEncounterFhir(id);
  }

  @Get('Observation')
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async searchObservations(
    @Query('patient') patientId?: string,
    @Query('encounter') caseId?: string,
  ) {
    return this.fhirService.getObservationsFhir(patientId, caseId);
  }

  @Get('MedicationRequest')
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async searchMedicationRequests(
    @Query('patient') patientId?: string,
    @Query('encounter') caseId?: string,
  ) {
    return this.fhirService.getMedicationRequestsFhir(patientId, caseId);
  }

  @Get('Appointment/:id')
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async getAppointment(@Param('id') id: string) {
    return this.fhirService.getAppointmentFhir(id);
  }
}
