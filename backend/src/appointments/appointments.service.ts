import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus, Prisma, QueueType } from '@prisma/client';
import { addMinutes, format, isBefore } from 'date-fns';
import { QueueService } from '../queue/queue.service';
import { PatientsService } from '../patients/patients.service';
import { CheckInAppointmentDto } from './dto/check-in-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { SmsWhatsappService } from '../communications/sms-whatsapp.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
    private patientsService: PatientsService,
    private smsWhatsappService: SmsWhatsappService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, branchId: string) {
    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      purpose,
      remarks,
    } = createAppointmentDto;
    const dateObj = this.parseDateOnly(appointmentDate);

    const result = await this.prisma.$transaction(
      async (tx) => {
        const appointmentDateOnly = this.toDateOnlyUtc(dateObj);
        const fullAppointmentDateTime = this.combineDateAndTime(
          appointmentDateOnly,
          appointmentTime,
        );
        await this.lockTransactionKey(
          tx,
          `appointment-slot-${doctorId}-${format(appointmentDateOnly, 'yyyy-MM-dd')}-${appointmentTime}`,
        );

        const patient = await tx.patient.findUnique({
          where: { id: patientId },
        });
        if (!patient) throw new NotFoundException('Patient not found');

        const doctorProfile = await tx.doctorProfile.findUnique({
          where: { id: doctorId },
          include: {
            user: true,
            schedules: {
              where: {
                dayOfWeek: appointmentDateOnly.getDay(),
                isActive: true,
              },
            },
          },
        });
        if (!doctorProfile)
          throw new NotFoundException('Doctor profile not found');

        await this.ensureNotHoliday(
          tx,
          appointmentDateOnly,
          'Cannot book appointment',
        );
        this.ensureDoctorAvailableAt(
          doctorProfile,
          appointmentDateOnly,
          appointmentTime,
        );

        const existing = await tx.appointment.findFirst({
          where: {
            doctorId,
            appointmentDate: appointmentDateOnly,
            appointmentTime: fullAppointmentDateTime,
            status: { notIn: [AppointmentStatus.CANCELLED] },
          },
        });

        if (existing)
          throw new ConflictException('This slot is already booked');

        // Check if there is already a case for this patient on this date to avoid duplicates if required.
        // The business logic dictates we create a PatientCase right at booking time.
        const caseNumber = await this.generateCaseNumber(tx, branchId, appointmentDateOnly, patientId);

        const patientCase = await tx.patientCase.create({
          data: {
            caseNumber,
            patientId,
            doctorId: doctorProfile.userId,
            branchId,
            visitType: purpose || 'CONSULTATION',
            priority: 'NORMAL',
            complaint: remarks,
            status: 'OPEN',
            stage: 'RECEPTION',
            visitDate: appointmentDateOnly,
          }
        });

        const appointment = await tx.appointment.create({
          data: {
            patientId,
            doctorId,
            branchId,
            appointmentDate: appointmentDateOnly,
            appointmentTime: fullAppointmentDateTime,
            purpose,
            remarks,
            status: AppointmentStatus.SCHEDULED,
            caseId: patientCase.id
          },
          include: {
            patient: true,
            doctor: {
              include: {
                user: true,
              },
            },
            patientCase: true
          },
        });
        
        await tx.patientCase.update({
          where: { id: patientCase.id },
          data: { appointment: { connect: { id: appointment.id } } }
        });

        const queueEntry = await this.queueService.createEntryInTransaction(
          tx,
          {
            caseId: patientCase.id,
            patientId,
            doctorId: doctorProfile.userId,
            priority: 'NORMAL',
            queueType: QueueType.OPD,
          },
          doctorProfile.userId,
          branchId,
        );

        return { ...appointment, patientCase: { ...patientCase, queueEntry } };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    // Trigger WhatsApp notification asynchronously
    const patientName = `${result.patient.firstName || ''} ${result.patient.lastName || ''}`.trim();
    const formattedDate = format(result.appointmentDate, 'PP') + ' at ' + format(result.appointmentTime, 'p');
    
    this.smsWhatsappService.sendWhatsApp({
      recipient: result.patient.mobile,
      content: `Hello ${patientName}, your appointment is confirmed for ${formattedDate}. Case ID: ${result.patientCase.caseNumber}.`,
      templateName: 'appointment_confirmation',
      templateParams: {
        patient_name: patientName,
        appointment_date: formattedDate,
        case_id: result.patientCase.caseNumber
      },
      patientId: result.patient.id,
      userId: 'SYSTEM',
    }).catch(err => {
      console.error('Failed to send WhatsApp confirmation', err);
    });

    return result;
  }

  async getAvailableSlots(doctorId: string, dateStr: string, branchId: string) {
    const date = this.parseDateOnly(dateStr);
    const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)

    // 1. Get Doctor Profile & Schedules
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: {
        schedules: {
          where: { dayOfWeek, isActive: true },
        },
      },
    });

    if (!doctorProfile) throw new NotFoundException('Doctor profile not found');

    // 2. Check Holiday (Branch specific or Global)
    const slotDate = this.toDateOnlyUtc(date);
    const holiday = await this.prisma.holiday.findFirst({
      where: {
        date: slotDate,
        OR: [{ branchId: null }, { branchId }],
      },
    });
    if (holiday) return [];

    // 2b. Check Doctor Leave
    const doctorLeave = await this.prisma.doctorLeave.findFirst({
      where: {
        doctorId,
        status: 'APPROVED',
        startDate: { lte: slotDate },
        endDate: { gte: slotDate },
      },
    });
    if (doctorLeave) return [];

    // 3. Get existing appointments and blocked slots
    const bookedAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        branchId,
        appointmentDate: slotDate,
        status: { notIn: ['CANCELLED', 'RESCHEDULED'] },
      },
      select: { appointmentTime: true },
    });

    const bookedTimes = bookedAppointments.map((a) =>
      format(a.appointmentTime, 'HH:mm'),
    );

    const blockedSlotsDb = await this.prisma.doctorBlockedSlot.findMany({
      where: {
        doctorId,
        branchId,
        date: slotDate,
      },
    });

    const slots: {
      time: string;
      status: 'available' | 'booked' | 'blocked';
    }[] = [];
    const duration = doctorProfile.slotDuration || 15;

    // Helper to check if a time string falls within any blocked slot
    const isBlocked = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      const slotTime = h * 60 + m;
      return blockedSlotsDb.some((b) => {
        const startH = b.startTime.getHours();
        const startM = b.startTime.getMinutes();
        const endH = b.endTime.getHours();
        const endM = b.endTime.getMinutes();
        const blockStart = startH * 60 + startM;
        const blockEnd = endH * 60 + endM;
        return slotTime >= blockStart && slotTime < blockEnd;
      });
    };

    // 4. Generate slots based on schedules
    for (const schedule of doctorProfile.schedules) {
      let current = new Date(date);
      current.setHours(
        schedule.startTime.getHours(),
        schedule.startTime.getMinutes(),
        0,
        0,
      );

      const end = new Date(date);
      end.setHours(
        schedule.endTime.getHours(),
        schedule.endTime.getMinutes(),
        0,
        0,
      );

      while (isBefore(current, end)) {
        const timeStr = format(current, 'HH:mm');
        let status: 'available' | 'booked' | 'blocked' = 'available';

        if (isBlocked(timeStr)) {
          status = 'blocked';
        } else if (bookedTimes.includes(timeStr)) {
          status = 'booked';
        }

        slots.push({
          time: timeStr,
          status,
        });
        current = addMinutes(current, duration);
      }
    }

    // Fallback to basic profile morning/evening if no schedules found
    if (
      slots.length === 0 &&
      (doctorProfile.morningStart || doctorProfile.eveningStart)
    ) {
      // Simple fallback logic if DoctorSchedule table isn't populated
      const sessions: { start: string; end: string }[] = [];
      if (doctorProfile.morningStart && doctorProfile.morningEnd) {
        sessions.push({
          start: doctorProfile.morningStart,
          end: doctorProfile.morningEnd,
        });
      }
      if (doctorProfile.eveningStart && doctorProfile.eveningEnd) {
        sessions.push({
          start: doctorProfile.eveningStart,
          end: doctorProfile.eveningEnd,
        });
      }

      for (const session of sessions) {
        const [startH, startM] = session.start.split(':').map(Number);
        const [endH, endM] = session.end.split(':').map(Number);

        let current = new Date(date);
        current.setHours(startH, startM, 0, 0);

        const end = new Date(date);
        end.setHours(endH, endM, 0, 0);

        while (isBefore(current, end)) {
          const timeStr = format(current, 'HH:mm');
          slots.push({
            time: timeStr,
            status: bookedTimes.includes(timeStr) ? 'booked' : 'available',
          });
          current = addMinutes(current, duration);
        }
      }
    }

    return slots;
  }

  async findAll(query: AppointmentQueryDto, branchId: string) {
    const {
      page = 1,
      limit = 10,
      q,
      doctorId,
      status,
      startDate,
      endDate,
      date,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = { branchId };

    if (date) {
      where.appointmentDate = this.parseDateOnly(date);
    } else if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate)
        (where.appointmentDate as any).gte = this.parseDateOnly(startDate);
      if (endDate)
        (where.appointmentDate as any).lte = this.parseDateOnly(endDate);
    }

    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    if (q) {
      const search = String(q);
      where.OR = [
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
        { patient: { mobile: { contains: search } } },
        { id: { contains: search, mode: 'insensitive' } },
        {
          patientCase: {
            caseNumber: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: true,
          doctor: {
            include: {
              user: true,
            },
          },
          patientCase: true,
        },
        orderBy: [{ appointmentDate: 'desc' }, { appointmentTime: 'desc' }],
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, branchId: string) {
    return this.prisma.appointment.findFirst({
      where: { id, branchId },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    userId: string,
    remarks?: string,
    branchId?: string,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        await this.lockTransactionKey(tx, `appointment-${id}`);
        const currentAppointment = await tx.appointment.findFirst({
          where: { id, ...(branchId ? { branchId } : {}) },
        });
        if (!currentAppointment)
          throw new NotFoundException('Appointment not found');

        if (currentAppointment.status === status) {
          return currentAppointment;
        }

        this.ensureValidStatusTransition(currentAppointment.status, status);
        if (status === AppointmentStatus.CHECKED_IN) {
          await this.ensureNotHoliday(
            tx,
            currentAppointment.appointmentDate,
            'Cannot check in appointment',
          );
        }

        const appointment = await tx.appointment.update({
          where: { id },
          data: {
            status,
            remarks: remarks || undefined,
          },
        });

        await tx.appointmentStatusHistory.create({
          data: {
            appointmentId: id,
            previousStatus: currentAppointment.status,
            status,
            changedById: userId,
            remarks,
          },
        });

        return appointment;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  async checkIn(dto: CheckInAppointmentDto, userId: string, branchId: string) {
    const { appointmentId, vitals, visitType, priority, complaint } = dto;

    return this.prisma.$transaction(
      async (tx) => {
        await this.lockTransactionKey(
          tx,
          `appointment-checkin-${appointmentId}`,
        );

        // 1. Get Appointment
        const appointment = await tx.appointment.findFirst({
          where: { id: appointmentId, branchId },
          include: {
            patient: true,
            doctor: true,
            patientCase: { include: { queueEntry: true } },
          },
        });
        if (!appointment) throw new NotFoundException('Appointment not found');

        if (
          appointment.status === AppointmentStatus.CHECKED_IN &&
          appointment.patientCase?.queueEntry
        ) {
          return {
            caseId: appointment.patientCase.id,
            queueEntry: appointment.patientCase.queueEntry,
            appointmentId,
          };
        }

        this.ensureValidStatusTransition(
          appointment.status,
          AppointmentStatus.CHECKED_IN,
        );
        await this.ensureNotHoliday(
          tx,
          appointment.appointmentDate,
          'Cannot check in appointment',
        );

        // 2. Create PatientCase if not exists (for legacy appointments without cases)
        let patientCase = appointment.patientCase;
        if (!patientCase) {
          const caseNumber = await this.generateCaseNumber(tx, branchId, appointment.appointmentDate, appointment.patientId);
          patientCase = await tx.patientCase.create({
            data: {
              caseNumber,
              patientId: appointment.patientId,
              doctorId: appointment.doctor.userId,
              branchId,
              visitType: visitType || appointment.purpose || 'CONSULTATION',
              priority: priority || 'NORMAL',
              complaint: complaint || appointment.remarks,
              status: 'OPEN',
              stage: 'NURSING',
              visitDate: appointment.appointmentDate,
              appointment: { connect: { id: appointmentId } },
            },
          }) as any;
        } else {
          await tx.patientCase.update({
            where: { id: patientCase.id },
            data: { stage: 'NURSING' }
          });
        }

        // 3. Save Vitals if provided
        if (vitals) {
          let bmi = vitals.bmi;
          if (!bmi && vitals.height && vitals.weight) {
            const h = vitals.height / 100;
            bmi = parseFloat((vitals.weight / (h * h)).toFixed(2));
          }

          await tx.patientVitals.create({
            data: {
              ...vitals,
              bmi,
              patientId: appointment.patientId,
              caseId: patientCase!.id,
              takenById: userId,
              branchId,
            },
          });
        }

        // 4. Create Queue Entry if not exists
        let queueEntry = appointment.patientCase?.queueEntry;
        if (!queueEntry) {
          queueEntry = await this.queueService.createEntryInTransaction(
            tx,
            {
              caseId: patientCase!.id,
              patientId: appointment.patientId,
              doctorId: appointment.doctor.userId,
              priority: priority || 'NORMAL',
              queueType: QueueType.OPD,
            },
            userId,
            branchId,
          );
        }

        // 5. Update Appointment Status
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: AppointmentStatus.CHECKED_IN },
        });

        await tx.appointmentStatusHistory.create({
          data: {
            appointmentId,
            previousStatus: appointment.status,
            status: AppointmentStatus.CHECKED_IN,
            changedById: userId,
            remarks: 'Checked-in from Reception',
          },
        });

        return {
          caseId: patientCase!.id,
          queueEntry,
          appointmentId,
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  async getAdminStats(branchId: string, dateStr?: string) {
    const targetDate = dateStr
      ? this.parseDateOnly(dateStr)
      : this.toDateOnlyUtc(new Date());

    const stats = await this.prisma.appointment.groupBy({
      by: ['status'],
      where: {
        branchId,
        appointmentDate: targetDate,
      },
      _count: true,
    });

    const result = {
      total: 0,
      scheduled: 0,
      confirmed: 0,
      checkedIn: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
    };

    stats.forEach((s) => {
      const count = s._count;
      result.total += count;
      switch (s.status) {
        case AppointmentStatus.SCHEDULED:
          result.scheduled = count;
          break;
        case AppointmentStatus.CONFIRMED:
          result.confirmed = count;
          break;
        case AppointmentStatus.CHECKED_IN:
          result.checkedIn = count;
          break;
        case AppointmentStatus.COMPLETED:
          result.completed = count;
          break;
        case AppointmentStatus.CANCELLED:
          result.cancelled = count;
          break;
        case AppointmentStatus.NO_SHOW:
          result.noShow = count;
          break;
      }
    });

    return result;
  }

  async reschedule(
    id: string,
    newDate: string,
    newTime: string,
    userId: string,
    remarks: string,
    branchId: string,
  ) {
    const dateObj = this.parseDateOnly(newDate);
    const appointmentDateOnly = this.toDateOnlyUtc(dateObj);
    const fullAppointmentDateTime = this.combineDateAndTime(
      appointmentDateOnly,
      newTime,
    );

    return this.prisma.$transaction(
      async (tx) => {
        await this.lockTransactionKey(tx, `appointment-${id}`);

        const appointment = await tx.appointment.findFirst({
          where: { id, branchId },
          include: { doctor: true },
        });

        if (!appointment) throw new NotFoundException('Appointment not found');

        this.ensureValidStatusTransition(
          appointment.status,
          AppointmentStatus.RESCHEDULED,
        );

        // Check slot availability
        const existing = await tx.appointment.findFirst({
          where: {
            doctorId: appointment.doctorId,
            appointmentDate: appointmentDateOnly,
            appointmentTime: fullAppointmentDateTime,
            status: { notIn: [AppointmentStatus.CANCELLED] },
            id: { not: id },
          },
        });

        if (existing) throw new ConflictException('New slot is already booked');

        const updated = await tx.appointment.update({
          where: { id },
          data: {
            appointmentDate: appointmentDateOnly,
            appointmentTime: fullAppointmentDateTime,
            status: AppointmentStatus.SCHEDULED, // Reset to scheduled after reschedule
            rescheduledById: userId,
            remarks: remarks || appointment.remarks,
          },
        });

        await tx.appointmentStatusHistory.create({
          data: {
            appointmentId: id,
            previousStatus: appointment.status,
            status: AppointmentStatus.RESCHEDULED,
            changedById: userId,
            remarks: `Rescheduled to ${newDate} ${newTime}. ${remarks}`,
          },
        });

        return updated;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  async cancel(id: string, reason: string, userId: string, branchId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        await this.lockTransactionKey(tx, `appointment-${id}`);

        const appointment = await tx.appointment.findFirst({
          where: { id, branchId },
        });

        if (!appointment) throw new NotFoundException('Appointment not found');

        this.ensureValidStatusTransition(
          appointment.status,
          AppointmentStatus.CANCELLED,
        );

        const updated = await tx.appointment.update({
          where: { id },
          data: {
            status: AppointmentStatus.CANCELLED,
            cancelReason: reason,
            cancelledById: userId,
          },
        });

        await tx.appointmentStatusHistory.create({
          data: {
            appointmentId: id,
            previousStatus: appointment.status,
            status: AppointmentStatus.CANCELLED,
            changedById: userId,
            remarks: `Cancelled: ${reason}`,
          },
        });

        return updated;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  private combineDateAndTime(date: Date, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    const value = new Date(date);
    value.setHours(hours, minutes, 0, 0);
    return value;
  }

  private parseDateOnly(dateStr: string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  private toDateOnlyUtc(date: Date) {
    return new Date(`${date.toISOString().slice(0, 10)}T00:00:00.000Z`);
  }

  private ensureDoctorAvailableAt(
    doctorProfile: any,
    date: Date,
    appointmentTime: string,
  ) {
    const [slotHours, slotMinutes] = appointmentTime.split(':').map(Number);
    const slotMinutesOfDay = slotHours * 60 + slotMinutes;
    const duration = doctorProfile.slotDuration || 15;

    const scheduleWindows = doctorProfile.schedules?.length
      ? doctorProfile.schedules.map((schedule: any) => ({
          start:
            schedule.startTime.getHours() * 60 +
            schedule.startTime.getMinutes(),
          end: schedule.endTime.getHours() * 60 + schedule.endTime.getMinutes(),
        }))
      : this.getFallbackScheduleWindows(doctorProfile);

    const isAvailable = scheduleWindows.some((window: any) => {
      return (
        slotMinutesOfDay >= window.start &&
        slotMinutesOfDay < window.end &&
        (slotMinutesOfDay - window.start) % duration === 0
      );
    });

    if (!isAvailable) {
      throw new BadRequestException(
        'Doctor is not available for this appointment slot',
      );
    }
  }

  private getFallbackScheduleWindows(doctorProfile: any) {
    const windows: { start: number; end: number }[] = [];
    const pushWindow = (start?: string | null, end?: string | null) => {
      if (!start || !end) return;
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      windows.push({ start: startH * 60 + startM, end: endH * 60 + endM });
    };

    pushWindow(doctorProfile.morningStart, doctorProfile.morningEnd);
    pushWindow(doctorProfile.eveningStart, doctorProfile.eveningEnd);
    return windows;
  }

  private ensureValidStatusTransition(
    current: AppointmentStatus,
    next: AppointmentStatus,
  ) {
    if (current === next) return;

    const allowed: Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.SCHEDULED]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CHECKED_IN,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
        AppointmentStatus.RESCHEDULED,
      ],
      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.CHECKED_IN,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
        AppointmentStatus.RESCHEDULED,
      ],
      [AppointmentStatus.CHECKED_IN]: [
        AppointmentStatus.IN_PROGRESS,
        AppointmentStatus.COMPLETED,
      ],
      [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED],
      [AppointmentStatus.COMPLETED]: [],
      [AppointmentStatus.CANCELLED]: [],
      [AppointmentStatus.NO_SHOW]: [AppointmentStatus.RESCHEDULED],
      [AppointmentStatus.RESCHEDULED]: [
        AppointmentStatus.SCHEDULED,
        AppointmentStatus.CANCELLED,
      ],
    };

    if (!allowed[current].includes(next)) {
      throw new BadRequestException(
        `Invalid appointment status transition: ${current} -> ${next}`,
      );
    }
  }

  private async ensureNotHoliday(
    tx: Prisma.TransactionClient,
    date: Date,
    prefix: string,
  ) {
    const holidayDate = this.toDateOnlyUtc(date);
    const holiday = await tx.holiday.findFirst({
      where: { date: holidayDate },
    });

    if (holiday) {
      throw new BadRequestException(
        `${prefix}; ${format(holidayDate, 'yyyy-MM-dd')} is a holiday: ${holiday.name}`,
      );
    }
  }

  private async generateCaseNumber(
    tx: Prisma.TransactionClient,
    branchId: string,
    appointmentDate: Date,
    patientId: string
  ): Promise<string> {
    const dateStr = format(appointmentDate, 'ddMMyy');

    await this.lockTransactionKey(tx, `case-number-${branchId}-${dateStr}`);
    await this.lockTransactionKey(tx, `case-patient-${patientId}`);

    const todayStart = new Date(appointmentDate);
    todayStart.setUTCHours(0,0,0,0);
    const todayEnd = new Date(appointmentDate);
    todayEnd.setUTCHours(23,59,59,999);

    const tokenCount = await tx.patientCase.count({
      where: {
        branchId,
        visitDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const tokenStr = (tokenCount + 1).toString().padStart(3, '0');

    const patientVisitsCount = await tx.patientCase.count({
      where: {
        patientId
      }
    });
    
    const visitStr = (patientVisitsCount + 1).toString().padStart(3, '0');

    return `C${tokenStr}-${visitStr}-${dateStr}`;
  }

  private async lockTransactionKey(tx: Prisma.TransactionClient, key: string) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}))`;
  }
}
