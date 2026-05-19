import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { ZeroTrustService } from './services/zero-trust.service';
import { SecurityAnalyticsService } from './services/security-analytics.service';
import { ThreatIntelligenceService } from './services/threat-intelligence.service';
import { DisasterRecoveryService } from './services/disaster-recovery.service';
import { IncidentResponseService } from './services/incident-response.service';
import { SecurityVaultService } from './services/security-vault.service';
import { DeviceSecurityService } from './services/device-security.service';
import { SecurityGovernanceService } from './services/security-governance.service';

@Controller('security')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SecurityResilienceController {
  constructor(
    private readonly zeroTrust: ZeroTrustService,
    private readonly analytics: SecurityAnalyticsService,
    private readonly threatIntel: ThreatIntelligenceService,
    private readonly dr: DisasterRecoveryService,
    private readonly incidentResponse: IncidentResponseService,
    private readonly vault: SecurityVaultService,
    private readonly deviceSecurity: DeviceSecurityService,
    private readonly governance: SecurityGovernanceService,
  ) {}

  // ==========================================
  // 1. Zero-Trust Security Core
  // ==========================================
  @Get('zero-trust/policy')
  async getPolicy() {
    return this.zeroTrust.getPolicy();
  }

  @Put('zero-trust/policy')
  async updatePolicy(@Body() body: any) {
    return this.zeroTrust.updatePolicy(body);
  }

  @Post('zero-trust/device')
  async registerDevice(@Body() body: any) {
    return this.zeroTrust.registerDevice(body);
  }

  @Get('zero-trust/devices')
  async getZeroTrustDevices() {
    return this.zeroTrust.getDevices();
  }

  @Get('zero-trust/ip-policies')
  async getIpPolicies() {
    return this.zeroTrust.getIpPolicies();
  }

  @Post('zero-trust/ip-policies')
  async addIpPolicy(@Body() body: any) {
    return this.zeroTrust.addIpPolicy(body);
  }

  @Get('zero-trust/geo-rules')
  async getGeoRules() {
    return this.zeroTrust.getGeoRules();
  }

  @Post('zero-trust/geo-rules')
  async addGeoRule(@Body() body: any) {
    return this.zeroTrust.addGeoRule(body);
  }

  @Post('zero-trust/risk/evaluate')
  async evaluateSessionRisk(@Body() body: any) {
    return this.zeroTrust.evaluateSessionRisk(body);
  }

  @Get('zero-trust/risk/scores')
  async getRiskScores() {
    return this.zeroTrust.getRiskScores();
  }

  // ==========================================
  // 2. SIEM & Audit Correlation (SOC)
  // ==========================================
  @Post('siem/events')
  async logEvent(@Body() body: any) {
    return this.analytics.logEvent(body);
  }

  @Get('siem/events')
  async getEvents(@Query('limit') limit?: number) {
    return this.analytics.getEvents(limit ? Number(limit) : 100);
  }

  @Get('siem/alerts')
  async getAlerts() {
    return this.analytics.getAlerts();
  }

  @Put('siem/alerts/:id')
  async updateAlertStatus(
    @Param('id') id: string,
    @Body() body: { status: 'NEW' | 'INVESTIGATING' | 'RESOLVED' | 'SUPPRESSED'; assignedTo?: string },
  ) {
    return this.analytics.updateAlertStatus(id, body.status, body.assignedTo);
  }

  @Get('siem/incidents')
  async getIncidents() {
    return this.analytics.getIncidents();
  }

  @Post('siem/incidents')
  async createIncident(@Body() body: any) {
    return this.analytics.createIncident(body);
  }

  @Put('siem/incidents/:id')
  async updateIncident(@Param('id') id: string, @Body() body: any) {
    return this.analytics.updateIncident(id, body);
  }

  @Get('siem/incidents/:id/timeline')
  async getIncidentTimeline(@Param('id') id: string) {
    return this.analytics.getIncidentTimeline(id);
  }

  @Post('siem/incidents/:id/timeline')
  async logTimeline(@Param('id') id: string, @Body() body: any) {
    return this.analytics.logTimeline({ incidentId: id, ...body });
  }

  @Post('siem/correlate')
  async runAuditCorrelations() {
    return this.analytics.runAuditCorrelations();
  }

  @Get('siem/correlations')
  async getCorrelations() {
    return this.analytics.getCorrelations();
  }

  // ==========================================
  // 3. Threat Intelligence Platform
  // ==========================================
  @Get('threat-intel/feeds')
  async getFeeds() {
    return this.threatIntel.getFeeds();
  }

  @Post('threat-intel/feeds/sync')
  async syncFeeds() {
    return this.threatIntel.syncFeeds();
  }

  @Get('threat-intel/compromised-credentials')
  async getCompromisedCredentials() {
    return this.threatIntel.getCompromisedCredentials();
  }

  @Post('threat-intel/compromised-credentials')
  async addCompromisedCredential(@Body() body: { email: string; source?: string }) {
    return this.threatIntel.addCompromisedCredential(body.email, body.source);
  }

  @Get('threat-intel/malicious-ips')
  async getMaliciousIps() {
    return this.threatIntel.getMaliciousIps();
  }

  @Get('threat-intel/malware-signatures')
  async getMalwareSignatures() {
    return this.threatIntel.getMalwareSignatures();
  }

  @Post('threat-intel/inspect/ip')
  async inspectIp(@Body() body: { ipAddress: string }) {
    return this.threatIntel.inspectIp(body.ipAddress);
  }

  @Post('threat-intel/inspect/hash')
  async inspectFileHash(@Body() body: { fileHash: string }) {
    return this.threatIntel.inspectFileHash(body.fileHash);
  }

  @Get('threat-intel/matches')
  async getMatches() {
    return this.threatIntel.getMatches();
  }

  // ==========================================
  // 4. Backup & Disaster Recovery
  // ==========================================
  @Get('dr/snapshots')
  async getSnapshots() {
    return this.dr.getSnapshots();
  }

  @Post('dr/snapshots')
  async createSnapshot(@Body() body: { snapshotName: string; backupType: 'FULL' | 'INCREMENTAL'; sizeBytes: number }) {
    return this.dr.createSnapshot(body);
  }

  @Get('dr/plans')
  async getPlans() {
    return this.dr.getPlans();
  }

  @Post('dr/plans')
  async createPlan(@Body() body: any) {
    return this.dr.createPlan(body);
  }

  @Get('dr/failover-regions')
  async getFailoverRegions() {
    return this.dr.getFailoverRegions();
  }

  @Get('dr/executions')
  async getExecutions() {
    return this.dr.getExecutions();
  }

  @Post('dr/executions/:planId/drill')
  async triggerDrill(@Param('planId') planId: string, @Body() body: { userId: string }) {
    return this.dr.triggerDrill(planId, body.userId);
  }

  @Get('dr/integrity-checks')
  async getIntegrityChecks() {
    return this.dr.getIntegrityChecks();
  }

  // ==========================================
  // 5. Incident Response Automation
  // ==========================================
  @Get('incident-response/playbooks')
  async getPlaybooks() {
    return this.incidentResponse.getPlaybooks();
  }

  @Post('incident-response/playbooks/:playbookId/trigger')
  async triggerPlaybook(@Param('playbookId') playbookId: string, @Body() body: { incidentId: string }) {
    return this.incidentResponse.triggerPlaybook(body.incidentId, playbookId);
  }

  @Get('incident-response/tasks/:incidentId')
  async getTasks(@Param('incidentId') incidentId: string) {
    return this.incidentResponse.getTasks(incidentId);
  }

  @Put('incident-response/tasks/:taskId')
  async updateTaskStatus(@Param('taskId') taskId: string, @Body() body: { status: any; assignee?: string }) {
    return this.incidentResponse.updateTaskStatus(taskId, body.status, body.assignee);
  }

  @Get('incident-response/escalations/:incidentId')
  async getEscalations(@Param('incidentId') incidentId: string) {
    return this.incidentResponse.getEscalations(incidentId);
  }

  @Post('incident-response/escalations/:incidentId')
  async triggerEscalation(@Param('incidentId') incidentId: string, @Body() body: any) {
    return this.incidentResponse.triggerEscalation(incidentId, body);
  }

  @Get('incident-response/artifacts/:incidentId')
  async getForensicArtifacts(@Param('incidentId') incidentId: string) {
    return this.incidentResponse.getForensicArtifacts(incidentId);
  }

  @Post('incident-response/artifacts/:incidentId')
  async uploadForensicArtifact(@Param('incidentId') incidentId: string, @Body() body: any) {
    return this.incidentResponse.uploadForensicArtifact(incidentId, body);
  }

  // ==========================================
  // 6. Enterprise Key Vault & Secrets Management
  // ==========================================
  @Get('vault/secrets')
  async getSecrets() {
    return this.vault.getSecrets();
  }

  @Post('vault/secrets')
  async storeSecret(@Body() body: { secretName: string; secretValue: string; secretType: string; rotationDays?: number }) {
    return this.vault.storeSecret(body);
  }

  @Post('vault/secrets/:secretId/reveal')
  async revealSecret(@Param('secretId') secretId: string, @Body() body: { userId: string }, @Req() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress || 'Unknown';
    return this.vault.revealSecret(secretId, body.userId, ipAddress);
  }

  @Delete('vault/secrets/:secretId')
  async deleteSecret(@Param('secretId') secretId: string, @Body() body: { userId: string }, @Req() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress || 'Unknown';
    return this.vault.deleteSecret(secretId, body.userId, ipAddress);
  }

  @Get('vault/keys')
  async getKeys() {
    return this.vault.getKeys();
  }

  @Get('vault/access-logs')
  async getAccessLogs() {
    return this.vault.getAccessLogs();
  }

  // ==========================================
  // 7. Endpoint & Biomedical Device Security
  // ==========================================
  @Get('devices/endpoints')
  async getDevices() {
    return this.deviceSecurity.getDevices();
  }

  @Post('devices/endpoints/:deviceId/compliance')
  async reportDeviceCompliance(@Param('deviceId') deviceId: string, @Body() body: any) {
    return this.deviceSecurity.reportDeviceCompliance(deviceId, body);
  }

  @Get('devices/endpoints/:deviceId/compliances')
  async getDeviceCompliances(@Param('deviceId') deviceId: string) {
    return this.deviceSecurity.getDeviceCompliances(deviceId);
  }

  @Get('devices/incidents')
  async getDeviceIncidents() {
    return this.deviceSecurity.getDeviceIncidents();
  }

  @Post('devices/incidents/:deviceId')
  async reportDeviceIncident(@Param('deviceId') deviceId: string, @Body() body: any) {
    return this.deviceSecurity.reportDeviceIncident(deviceId, body);
  }

  @Get('devices/biomedical')
  async getBiomedicalDevices() {
    return this.deviceSecurity.getBiomedicalDevices();
  }

  @Put('devices/biomedical/:assetId/firmware')
  async updateBiomedicalFirmware(@Param('assetId') assetId: string, @Body() body: any) {
    return this.deviceSecurity.updateBiomedicalFirmware(assetId, body);
  }

  // ==========================================
  // 8. Security Governance & Compliance Command Center
  // ==========================================
  @Get('governance/frameworks')
  async getFrameworks() {
    return this.governance.getFrameworks();
  }

  @Get('governance/frameworks/:frameworkId/controls')
  async getControls(@Param('frameworkId') frameworkId: string) {
    return this.governance.getControls(frameworkId);
  }

  @Put('governance/controls/:controlId')
  async updateControlStatus(@Param('controlId') controlId: string, @Body() body: { status: 'IMPLEMENTED' | 'PARTIAL'; evidenceUrl?: string }) {
    return this.governance.updateControlStatus(controlId, body.status, body.evidenceUrl);
  }

  @Get('governance/assessments')
  async getAssessments() {
    return this.governance.getAssessments();
  }

  @Get('governance/vulnerability-scans')
  async getVulnerabilityScans() {
    return this.governance.getVulnerabilityScans();
  }

  @Get('governance/penetration-tests')
  async getPenetrationTests() {
    return this.governance.getPenetrationTests();
  }
}
