import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { PatientProfileService } from './services/patient-profile.service';
import { PatientPreferencesService } from './services/patient-preferences.service';
import { PatientSessionService } from './services/patient-session.service';

@Controller('patient-app')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PatientAppController {
  constructor(
    private readonly profileService: PatientProfileService,
    private readonly preferencesService: PatientPreferencesService,
    private readonly sessionService: PatientSessionService,
  ) {}

  @Get('profile')
  async getProfile(@Query('patientId') patientId: string) {
    return this.profileService.getProfile(patientId || 'default-patient');
  }

  @Post('profile')
  async updateProfile(@Query('patientId') patientId: string, @Body() data: any) {
    return this.profileService.updateProfile(patientId || 'default-patient', data);
  }

  @Get('preferences')
  async getPreferences(@Query('patientId') patientId: string) {
    return this.preferencesService.getPreferences(patientId || 'default-patient');
  }

  @Post('preferences')
  async updatePreferences(@Query('patientId') patientId: string, @Body() data: any) {
    return this.preferencesService.updatePreferences(patientId || 'default-patient', data);
  }

  @Get('devices')
  async getDevices(@Query('patientId') patientId: string) {
    return this.sessionService.getDevices(patientId || 'default-patient');
  }

  @Post('devices/register')
  async registerDevice(@Query('patientId') patientId: string, @Body() data: any) {
    return this.sessionService.registerDevice(patientId || 'default-patient', data);
  }

  @Post('sessions/track')
  async trackSession(@Query('patientId') patientId: string, @Body() data: any) {
    return this.sessionService.trackSession(patientId || 'default-patient', data);
  }
}