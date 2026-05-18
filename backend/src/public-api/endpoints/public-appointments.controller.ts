import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';
import { Scopes } from '../auth/scopes.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { PublicWebhookService } from '../webhooks/public-webhook.service';
import { ApiClientCtx } from '../context/request-api-client.context';
import type { RequestApiClientContext } from '../context/request-api-client.context';
import { PublicApiScopeService } from '../scope/public-api-scope.service';
import { ApiAuditInterceptor } from '../audit/api-audit.interceptor';
import { ApiMetricsInterceptor } from '../metrics/api-metrics.interceptor';
import { ApiQuotaGuard } from '../usage/api-quota.guard';

@Controller('api/v2/appointments')
@UseGuards(ApiKeyGuard, ApiQuotaGuard, RateLimitGuard)
@UseInterceptors(ApiAuditInterceptor, ApiMetricsInterceptor)
export class PublicAppointmentsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webhookService: PublicWebhookService,
    private readonly scope: PublicApiScopeService,
  ) {}

  @Get()
  @Scopes('appointments:read')
  async getAppointments(
    @ApiClientCtx() ctx: RequestApiClientContext,
    @Query('patientId') patientId?: string,
  ) {
    const where = await this.scope.buildAppointmentWhere(
      ctx,
      patientId ? { patientId } : undefined,
    );

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        doctor: {
          include: { user: { select: { name: true } } },
        },
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  @Post()
  @Scopes('appointments:write')
  async createAppointment(
    @ApiClientCtx() ctx: RequestApiClientContext,
    @Body()
    body: {
      patientId: string;
      doctorId: string;
      appointmentDate: string;
      reason?: string;
      branchId?: string;
    },
  ) {
    const branchIds = await this.scope.resolveBranchIds(ctx);
    const branchId = ctx.branchId ?? body.branchId ?? branchIds[0];

    if (!branchId || !branchIds.includes(branchId)) {
      throw new BadRequestException('Invalid or unauthorized branchId');
    }

    await this.scope.assertPatientAccess(ctx, body.patientId);

    const dateObj = new Date(body.appointmentDate);

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: body.patientId,
        doctorId: body.doctorId,
        appointmentDate: dateObj,
        appointmentTime: dateObj,
        purpose: body.reason || 'External API appointment creation',
        branchId,
        status: AppointmentStatus.SCHEDULED,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { include: { user: { select: { name: true } } } },
      },
    });

    await this.webhookService.triggerWebhook(
      'appointment.created',
      {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        doctorName: appointment.doctor.user.name,
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        branchId: appointment.branchId,
      },
      branchId,
    );

    return appointment;
  }

  @Put(':id/cancel')
  @Scopes('appointments:write')
  async cancelAppointment(
    @ApiClientCtx() ctx: RequestApiClientContext,
    @Param('id') id: string,
  ) {
    await this.scope.assertAppointmentAccess(ctx, id);

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { include: { user: { select: { name: true } } } },
      },
    });

    await this.webhookService.triggerWebhook(
      'appointment.cancelled',
      {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        doctorName: appointment.doctor.user.name,
        appointmentDate: appointment.appointmentDate,
        status: appointment.status,
        branchId: appointment.branchId,
      },
      appointment.branchId,
    );

    return appointment;
  }
}
