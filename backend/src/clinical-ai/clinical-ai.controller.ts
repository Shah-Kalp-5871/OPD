import {
  Controller, Post, Get, Patch, Body, Param, Query,
  UseGuards, Request, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClinicalDecisionSupportService } from './clinical-decision-support.service';
import { ClinicalRiskEngineService } from './clinical-risk-engine.service';
import { InventoryIntelligenceService } from './inventory-intelligence.service';
import { OperationalIntelligenceService } from './operational-intelligence.service';
import { CdsRequestDto, AiOutcomeDto } from './dto/cds.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai')
export class ClinicalAiController {
  constructor(
    private readonly cds: ClinicalDecisionSupportService,
    private readonly riskEngine: ClinicalRiskEngineService,
    private readonly inventoryIntel: InventoryIntelligenceService,
    private readonly opsIntel: OperationalIntelligenceService,
  ) {}

  // ─── Clinical Decision Support ───────────────────────────────────────────

  @Post('clinical/suggest')
  @Roles('DOCTOR', 'ADMIN', 'SUPERADMIN')
  async getClinicalSuggestions(@Body() dto: CdsRequestDto, @Request() req: any) {
    return this.cds.getSuggestions(dto, req.user.id);
  }

  @Patch('clinical/outcome')
  @Roles('DOCTOR', 'ADMIN', 'SUPERADMIN')
  async recordSuggestionOutcome(@Body() dto: AiOutcomeDto, @Request() req: any) {
    await this.cds.recordOutcome(dto, req.user.id);
    return { success: true, message: 'Outcome recorded' };
  }

  @Get('audit/logs')
  @Roles('SUPERADMIN', 'ADMIN', 'CLINIC_MANAGER', 'CENTRAL_FINANCE')
  async getAiAuditLogs(
    @Query('branchId') branchId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.cds.getAuditLogs(branchId, page, limit);
  }

  // ─── Clinical Risk Engine ────────────────────────────────────────────────

  @Post('risk/evaluate')
  @Roles('DOCTOR', 'NURSING', 'ADMIN', 'SUPERADMIN')
  async evaluatePatientRisk(
    @Body() body: { patientId: string; branchId: string; caseId?: string },
  ) {
    return this.riskEngine.evaluatePatientRisk(body.patientId, body.branchId, body.caseId);
  }

  @Get('risk/patient/:patientId')
  @Roles('DOCTOR', 'NURSING', 'ADMIN', 'SUPERADMIN', 'RECEPTION')
  async getPatientRiskFlags(@Param('patientId') patientId: string) {
    return this.riskEngine.getPatientRiskFlags(patientId);
  }

  @Patch('risk/flag/:flagId/acknowledge')
  @Roles('DOCTOR', 'NURSING', 'ADMIN', 'SUPERADMIN')
  async acknowledgeRiskFlag(@Param('flagId') flagId: string, @Request() req: any) {
    await this.riskEngine.acknowledgeFlag(flagId, req.user.id);
    return { success: true };
  }

  @Get('risk/branch/:branchId/summary')
  @Roles('ADMIN', 'SUPERADMIN', 'CLINIC_MANAGER', 'BRANCH_ADMIN')
  async getBranchRiskSummary(@Param('branchId') branchId: string) {
    return this.riskEngine.getBranchRiskSummary(branchId);
  }

  // ─── Inventory Intelligence ──────────────────────────────────────────────

  @Get('inventory/forecast')
  @Roles('ADMIN', 'SUPERADMIN', 'PHARMACY', 'CENTRAL_PHARMACY', 'CLINIC_MANAGER')
  async getStockForecast(
    @Query('branchId') branchId: string,
    @Query('daysAhead', new DefaultValuePipe(30), ParseIntPipe) daysAhead: number,
  ) {
    return this.inventoryIntel.getStockForecast(branchId, daysAhead);
  }

  @Get('inventory/expiry-risk')
  @Roles('ADMIN', 'SUPERADMIN', 'PHARMACY', 'CENTRAL_PHARMACY', 'CLINIC_MANAGER')
  async getExpiryRisk(@Query('branchId') branchId: string) {
    return this.inventoryIntel.getExpiryRiskReport(branchId);
  }

  @Get('inventory/slow-moving')
  @Roles('ADMIN', 'SUPERADMIN', 'PHARMACY', 'CENTRAL_PHARMACY', 'CLINIC_MANAGER')
  async getSlowMoving(
    @Query('branchId') branchId: string,
    @Query('thresholdDays', new DefaultValuePipe(90), ParseIntPipe) thresholdDays: number,
  ) {
    return this.inventoryIntel.getSlowMovingInventory(branchId, thresholdDays);
  }

  @Get('inventory/reorder')
  @Roles('ADMIN', 'SUPERADMIN', 'PHARMACY', 'CENTRAL_PHARMACY', 'CLINIC_MANAGER')
  async getReorderRecommendations(@Query('branchId') branchId: string) {
    return this.inventoryIntel.getReorderRecommendations(branchId);
  }

  // ─── Operational Intelligence ────────────────────────────────────────────

  @Post('ops/scan')
  @Roles('SUPERADMIN', 'ADMIN', 'CLINIC_MANAGER', 'CENTRAL_FINANCE')
  async runAnomalyScan(@Body() body: { branchId: string }) {
    return this.opsIntel.runAnomalyScan(body.branchId);
  }

  @Get('ops/anomalies')
  @Roles('SUPERADMIN', 'ADMIN', 'CLINIC_MANAGER', 'CENTRAL_FINANCE')
  async getAnomalies(
    @Query('branchId') branchId: string,
    @Query('status') status = 'OPEN',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.opsIntel.getAnomalies(branchId, status, page, limit);
  }

  @Patch('ops/anomalies/:id')
  @Roles('SUPERADMIN', 'ADMIN', 'CLINIC_MANAGER', 'CENTRAL_FINANCE')
  async updateAnomaly(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
    @Request() req: any,
  ) {
    return this.opsIntel.updateAnomalyStatus(id, body.status, req.user.id, body.notes);
  }

  @Get('ops/appointments')
  @Roles('SUPERADMIN', 'ADMIN', 'CLINIC_MANAGER', 'BRANCH_ADMIN')
  async getAppointmentIntelligence(@Query('branchId') branchId: string) {
    return this.opsIntel.getAppointmentIntelligence(branchId);
  }

  @Get('ops/revenue-forecast')
  @Roles('SUPERADMIN', 'ADMIN', 'CLINIC_MANAGER', 'CENTRAL_FINANCE')
  async getRevenueForecast(@Query('branchId') branchId?: string) {
    return this.opsIntel.getRevenueForecast(branchId);
  }
}
