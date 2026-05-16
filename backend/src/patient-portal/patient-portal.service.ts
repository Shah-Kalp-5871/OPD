import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PatientPortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Request OTP for login
   */
  async requestOtp(mobile: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { mobile },
    });

    if (!patient) {
      throw new BadRequestException('Patient not registered with this mobile number');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.patientAuth.upsert({
      where: { patientId: patient.id },
      update: { otp, otpExpires },
      create: { patientId: patient.id, otp, otpExpires },
    });

    // Send OTP via SMS
    await this.notificationsService.sendNotification({
      recipient: mobile,
      type: 'SMS',
      templateName: 'OTP_LOGIN',
      data: { otp },
      patientId: patient.id,
    });

    return { message: 'OTP sent successfully' };
  }

  /**
   * Verify OTP and return JWT
   */
  async verifyOtp(mobile: string, otp: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { mobile },
      include: { auth: true },
    });

    if (!patient || !patient.auth) {
      throw new UnauthorizedException('Invalid request');
    }

    if (patient.auth.otp !== otp || !patient.auth.otpExpires || patient.auth.otpExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Clear OTP after successful verify
    await this.prisma.patientAuth.update({
      where: { patientId: patient.id },
      data: { otp: null, otpExpires: null, lastLogin: new Date(), mobileVerified: true },
    });

    const payload = { 
      sub: patient.id, 
      mrdNumber: patient.mrdNumber,
      role: 'PATIENT' 
    };

    return {
      access_token: this.jwtService.sign(payload),
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        mrdNumber: patient.mrdNumber,
      },
    };
  }

  /**
   * Get patient profile and history
   */
  async getProfile(patientId: string) {
    return this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        profile: true,
        appointments: {
          orderBy: { appointmentDate: 'desc' },
          take: 5,
        },
        bills: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        cases: {
          include: {
            consultation: true,
            investigationOrders: {
              include: { results: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }
}
