import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post('consent/record')
  async recordConsent(
    @Body() body: { patientId: string; consentType: string; signatureText?: string },
    @Req() req: any,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    return this.auditService.recordConsent({
      ...body,
      ipAddress,
      userAgent,
    });
  }

  @Post('consent/withdraw/:id')
  async withdrawConsent(@Param('id') id: string) {
    return this.auditService.withdrawConsent(id);
  }

  @Get('consent/patient/:patientId')
  async getPatientConsents(@Param('patientId') patientId: string) {
    return this.auditService.getPatientConsents(patientId);
  }

  // --- SECURE SECURITY ANALYTICS DASHBOARD (ADMINS ONLY) ---

  @Get('admin/logs')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async getLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('actionType') actionType?: string,
    @Query('branchId') branchId?: string,
    @Query('userId') userId?: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.auditService.getLogs(Number(page), Number(limit), {
      actionType,
      branchId,
      userId,
      patientId,
    });
  }

  @Get('admin/suspicious')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async getSuspiciousAccess() {
    return this.auditService.getSuspiciousAccess();
  }

  @Get('admin/failed-logins')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async getFailedLoginSpikes() {
    return this.auditService.getFailedLoginSpikes();
  }

  @Get('admin/cross-branch')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async getCrossBranchAttempts() {
    return this.auditService.getCrossBranchAttempts();
  }

  @Get('admin/high-risk')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async getHighRiskLogs() {
    return this.auditService.getHighRiskLogs();
  }
}
