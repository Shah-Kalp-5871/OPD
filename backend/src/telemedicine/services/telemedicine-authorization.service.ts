import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class TelemedicineAuthorizationService {
  private readonly logger = new Logger(TelemedicineAuthorizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Authorizes whether a specific user (Patient or Doctor) can join the telemedicine session for an appointment.
   * Restricts access based on:
   * 1. Appointment existence and non-cancelled status.
   * 2. Identity matching (User is either the assigned doctor or the patient).
   * 3. Scheduled time window validity (allows joining 15 minutes prior to appointment start and up to 4 hours after).
   * 4. Financial compliance (Patient is FOC, has a PAID/FOC bill, or has a SUCCEEDED/SUCCESS payment intent).
   */
  async authorizeRoomAccess(
    userId: string,
    userRole: string,
    appointmentId: string,
  ): Promise<boolean> {
    this.logger.log(
      `Checking telemedicine authorization for User: ${userId} (${userRole}) on Appointment: ${appointmentId}`,
    );

    // 1. Retrieve the appointment with full associations
    const appointment = await this.prisma.read.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
        paymentIntent: true,
      },
    });

    if (!appointment) {
      this.logger.warn(`Telemedicine auth failed: Appointment ${appointmentId} not found`);
      throw new NotFoundException('Appointment not found');
    }

    // 2. Validate appointment status is not cancelled or no-show
    const invalidStatuses: AppointmentStatus[] = [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW];
    if (invalidStatuses.includes(appointment.status)) {
      this.logger.warn(
        `Telemedicine auth failed: Appointment ${appointmentId} has invalid status ${appointment.status}`,
      );
      throw new ForbiddenException(`Cannot join consultation for a ${appointment.status.toLowerCase()} appointment`);
    }

    // 3. Identity Verification: Validate that user is the patient or assigned doctor
    const isPatient = appointment.patientId === userId;
    const isDoctor = appointment.doctor.userId === userId;

    if (!isPatient && !isDoctor) {
      this.logger.warn(
        `Telemedicine auth failed: User ${userId} is neither the patient ${appointment.patientId} nor the doctor ${appointment.doctor.userId}`,
      );
      throw new ForbiddenException('You are not authorized to access this consultation room');
    }

    // 4. Validate time window: 15 minutes buffer before, 4 hours buffer after
    const now = new Date();
    const startTime = new Date(appointment.appointmentTime);
    const minStart = new Date(startTime.getTime() - 15 * 60 * 1000); // 15 mins early
    const maxEnd = new Date(startTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours buffer

    if (now < minStart) {
      this.logger.warn(
        `Telemedicine auth failed: Too early. Allowed from ${minStart.toISOString()}, Current time: ${now.toISOString()}`,
      );
      throw new ForbiddenException('Consultation session has not started yet. Please try closer to the scheduled time');
    }

    if (now > maxEnd) {
      this.logger.warn(
        `Telemedicine auth failed: Session expired. Allowed until ${maxEnd.toISOString()}, Current time: ${now.toISOString()}`,
      );
      throw new ForbiddenException('This consultation session has already expired and is closed');
    }

    // 5. Financial Validation: Check if payment is settled
    const isPatientFoc = appointment.patient?.isFoc === true;
    if (isPatientFoc) {
      this.logger.log(`Telemedicine auth successful: Patient ${appointment.patientId} is FOC (Free of Charge)`);
      return true;
    }

    // Check successful payment intent
    const hasSuccessfulPaymentIntent =
      appointment.paymentIntent &&
      ['SUCCEEDED', 'SUCCESS', 'succeeded', 'success'].includes(appointment.paymentIntent.status);

    if (hasSuccessfulPaymentIntent) {
      this.logger.log(`Telemedicine auth successful: Valid payment intent found for Appointment ${appointmentId}`);
      return true;
    }

    // Check bills associated with patient & caseId
    if (appointment.caseId) {
      const paidBill = await this.prisma.read.bill.findFirst({
        where: {
          caseId: appointment.caseId,
          paymentStatusEnum: { in: ['PAID', 'FOC'] },
        },
      });

      if (paidBill) {
        this.logger.log(`Telemedicine auth successful: Settled bill found for Case ${appointment.caseId}`);
        return true;
      }
    }

    this.logger.warn(`Telemedicine auth failed: Payment not completed for Appointment ${appointmentId}`);
    throw new ForbiddenException('Payment is required before joining the telemedicine consultation room');
  }
}
