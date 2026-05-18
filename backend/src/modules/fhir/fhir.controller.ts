import { Controller, Get, Post, Put, Param, Query, Body, Header, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { FhirService } from './fhir.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller()
export class FhirController {
  constructor(private readonly fhirService: FhirService) {}

  private extractTenantId(req: any): string {
    const tenantId = req.headers['x-tenant-id'] || req.tenantId || req.user?.tenantId || 'default-tenant-id';
    return typeof tenantId === 'string' ? tenantId : 'default-tenant-id';
  }

  // --- FHIR metadata (CapabilityStatement) ---
  @Get('api/v2/fhir/metadata')
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async getCapabilityStatement() {
    return this.fhirService.getCapabilityStatement();
  }

  // --- FHIR Patient endpoints ---
  @Get('api/v2/fhir/Patient/:id')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async getPatient(@Param('id') id: string, @Req() req: any) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.getPatientFhir(id, tenantId);
  }

  @Get('api/v2/fhir/Patient')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async searchPatients(
    @Query('name') name: string,
    @Query('mobile') mobile: string,
    @Query('mrd') mrd: string,
    @Req() req: any,
  ) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.searchPatientsFhir({ name, mobile, mrd }, tenantId);
  }

  @Post('api/v2/fhir/Patient')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async createPatient(@Body() body: any, @Req() req: any) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.createPatientFhir(body, tenantId);
  }

  @Put('api/v2/fhir/Patient/:id')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async updatePatient(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.updatePatientFhir(id, body, tenantId);
  }

  // --- FHIR Observation endpoints ---
  @Get('api/v2/fhir/Observation')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async searchObservations(
    @Query('patient') patientId: string,
    @Query('encounter') caseId: string,
    @Req() req: any,
  ) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.getObservationsFhir(patientId, caseId, tenantId);
  }

  @Post('api/v2/fhir/Observation')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async createObservation(@Body() body: any, @Req() req: any) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.createObservationFhir(body, tenantId);
  }

  // --- FHIR Encounter endpoints ---
  @Get('api/v2/fhir/Encounter/:id')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async getEncounter(@Param('id') id: string, @Req() req: any) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.getEncounterFhir(id, tenantId);
  }

  // --- FHIR MedicationRequest endpoints ---
  @Get('api/v2/fhir/MedicationRequest')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async searchMedicationRequests(
    @Query('patient') patientId: string,
    @Query('encounter') caseId: string,
    @Req() req: any,
  ) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.getMedicationRequestsFhir(patientId, caseId, tenantId);
  }

  // --- FHIR Appointment endpoints ---
  @Get('api/v2/fhir/Appointment/:id')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/fhir+json; charset=utf-8')
  async getAppointment(@Param('id') id: string, @Req() req: any) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.getAppointmentFhir(id, tenantId);
  }

  // --- Terminology Lookup & Search ---
  @Get('api/v2/terminology/search')
  async searchTerms(@Query('q') query: string) {
    return this.fhirService.searchTerminology(query || '');
  }

  @Get('api/v2/terminology/icd10/:code')
  async lookupIcd10Code(@Param('code') code: string) {
    return this.fhirService.lookupIcd10(code);
  }

  // --- SMART-on-FHIR Dynamic Consent Management ---
  @Post('api/v2/fhir/consent')
  @UseGuards(JwtAuthGuard)
  async createConsent(
    @Body('patientId') patientId: string,
    @Body('consentType') consentType: string,
    @Body('signatureBase64') signatureBase64: string,
    @Req() req: any,
  ) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.createConsentArtifact(patientId, consentType, signatureBase64, tenantId);
  }

  @Post('api/v2/fhir/consent/grant')
  @UseGuards(JwtAuthGuard)
  async grantConsent(
    @Body('patientId') patientId: string,
    @Body('artifactId') artifactId: string,
    @Body('requesterSystem') requesterSystem: string,
    @Body('scopes') scopes: string[],
    @Body('expiresInHours') expiresInHours: number,
    @Req() req: any,
  ) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.grantConsentScope(patientId, artifactId, requesterSystem, scopes, expiresInHours || 24, tenantId);
  }

  @Post('api/v2/fhir/consent/revoke/:id')
  @UseGuards(JwtAuthGuard)
  async revokeConsent(
    @Param('id') grantId: string,
    @Body('revokedBy') revokedBy: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const tenantId = this.extractTenantId(req);
    return this.fhirService.revokeConsentGrant(grantId, revokedBy, reason, tenantId);
  }

  // --- Bulk Export ($export) Pipeline ---
  @Post('api/v2/fhir/\\$export')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerBulkExport(@Req() req: any) {
    const tenantId = this.extractTenantId(req);
    const job = await this.fhirService.triggerBulkExport(tenantId);
    
    // Respond with standard FHIR async headers
    req.res.setHeader('Content-Location', `http://medflow.org/api/v2/fhir/$export/status/${job.id}`);
    return {
      message: 'Export job initiated',
      jobId: job.id,
    };
  }

  @Get('api/v2/fhir/\\$export/status/:id')
  @UseGuards(JwtAuthGuard)
  async getExportStatus(@Param('id') id: string, @Req() req: any) {
    const tenantId = this.extractTenantId(req);
    const job = await this.fhirService.getExportJobStatus(id, tenantId);

    if (job.status === 'COMPLETED') {
      return {
        transactionTime: job.updatedAt.toISOString(),
        request: `http://medflow.org/api/v2/fhir/$export`,
        requiresAccessToken: true,
        output: [
          {
            type: 'Patient',
            url: job.fileUrl,
          },
        ],
        error: [],
      };
    }

    if (job.status === 'FAILED') {
      return {
        status: 'FAILED',
        error: job.error,
      };
    }

    // Still processing - respond with 202 and X-Progress header
    req.res.status(HttpStatus.ACCEPTED);
    req.res.setHeader('X-Progress', `${job.status}`);
    return {
      status: job.status,
    };
  }
}
