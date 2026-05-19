import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { PatientBookingService } from './services/patient-booking.service';
import { QueueExperienceService } from './services/queue-experience.service';

@Controller('self-service')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SelfServiceController {
  constructor(
    private readonly bookingService: PatientBookingService,
    private readonly queueService: QueueExperienceService,
  ) {}

  @Post('book')
  async selfBook(@Body() body: any) {
    return this.bookingService.selfBookAppointment(
      body.patientId || 'default-patient',
      body.doctorId || 'default-doctor',
      body.appointmentDate || new Date().toISOString(),
    );
  }

  @Post('queue/token')
  async generateToken(@Body() body: any) {
    return this.queueService.generateToken(
      body.patientId || 'default-patient',
      body.departmentId,
      body.doctorId,
    );
  }

  @Get('queue/status')
  async getQueueStatus(@Query('patientId') patientId: string) {
    return this.queueService.getQueueStatus(patientId || 'default-patient');
  }

  @Post('checkin')
  async digitalCheckin(@Body() body: any) {
    return this.queueService.digitalCheckin(
      body.patientId || 'default-patient',
      body.appointmentId,
      body.deviceType,
    );
  }
}