import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto, UpdateDoctorDto, CreateDoctorLeaveDto } from './dto/doctor.dto';
import * as bcrypt from 'bcrypt';
import { Role, AppointmentStatus } from '@prisma/client';
import { SmsWhatsappService } from '../communications/sms-whatsapp.service';

@Injectable()
export class DoctorsService {
  constructor(
    private prisma: PrismaService,
    private smsWhatsappService: SmsWhatsappService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createDoctorDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createDoctorDto.name,
        email: createDoctorDto.email,
        password: hashedPassword,
        role: Role.DOCTOR,
        doctorProfile: {
          create: {
            consultationFee: createDoctorDto.consultationFee,
            specialization: createDoctorDto.specialization,
            licenseNumber: createDoctorDto.licenseNumber,
            shifts: {
              create: createDoctorDto.shifts?.map(s => ({
                dayOfWeek: s.dayOfWeek,
                startTime: s.startTime,
                endTime: s.endTime,
                slotDuration: s.slotDuration,
                appointmentGap: s.appointmentGap ?? 0,
              })) || [],
            },
          },
        },
      },
      include: {
        doctorProfile: {
          include: {
            shifts: true,
          }
        },
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const doctors = await this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      include: {
        doctorProfile: {
          include: {
            shifts: true,
          }
        },
      },
    });

    return doctors.map(({ password, ...user }) => user);
  }

  async findOne(id: string) {
    const doctor = await this.prisma.user.findFirst({
      where: { id, role: Role.DOCTOR },
      include: {
        doctorProfile: {
          include: {
            shifts: true,
            shiftOverrides: true,
          }
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const { password, ...result } = doctor;
    return result;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.prisma.user.findFirst({
      where: { id, role: Role.DOCTOR },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const updateData: any = {
      name: updateDoctorDto.name,
      email: updateDoctorDto.email,
      isActive: updateDoctorDto.isActive,
    };

    if (updateDoctorDto.password) {
      updateData.password = await bcrypt.hash(updateDoctorDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        doctorProfile: {
          update: {
            consultationFee: updateDoctorDto.consultationFee,
            specialization: updateDoctorDto.specialization,
            licenseNumber: updateDoctorDto.licenseNumber,
          },
        },
      },
      include: {
        doctorProfile: true,
      },
    });

    if (updateDoctorDto.shifts && updatedUser.doctorProfile) {
      await this.prisma.doctorShift.deleteMany({
        where: { doctorId: updatedUser.doctorProfile.id }
      });
      if (updateDoctorDto.shifts.length > 0) {
        await this.prisma.doctorShift.createMany({
          data: updateDoctorDto.shifts.map(s => ({
            doctorId: updatedUser.doctorProfile!.id,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            slotDuration: s.slotDuration,
            appointmentGap: s.appointmentGap ?? 0,
          }))
        });
      }

      // TODO: Here we should call the conflict resolution shifting engine
      await this.resolveScheduleConflicts(updatedUser.doctorProfile.id);
    }

    const finalUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        doctorProfile: {
          include: {
            shifts: true,
          }
        }
      }
    });

    const { password: _, ...result } = finalUser!;
    return result;
  }

  private generateSlotsForShifts(shifts: any[]): string[] {
    const validSlots: string[] = [];
    shifts.forEach(shift => {
      if (!shift.startTime || !shift.endTime || !shift.slotDuration) return;

      const [startHour, startMin] = shift.startTime.split(':').map(Number);
      const [endHour, endMin] = shift.endTime.split(':').map(Number);

      if (isNaN(startHour) || isNaN(endHour) || shift.slotDuration <= 0) return;

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      let currentMinutes = startMinutes;
      while (currentMinutes + shift.slotDuration <= endMinutes) {
        const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
        const m = (currentMinutes % 60).toString().padStart(2, '0');
        validSlots.push(`${h}:${m}`);
        currentMinutes += shift.slotDuration;
      }
    });
    return validSlots;
  }

  private async findNextAvailableSlot(doctorId: string, startDate: Date, allShifts: any[]) {
    const currentDate = new Date(startDate);
    
    // Look up to 30 days ahead to prevent infinite loops
    for (let i = 0; i < 30; i++) {
      const dayOfWeek = currentDate.getDay();
      const shiftsForDay = allShifts.filter(s => s.dayOfWeek === dayOfWeek);

      if (shiftsForDay.length > 0) {
        const possibleSlots = this.generateSlotsForShifts(shiftsForDay);
        
        // Find booked slots for this date
        const bookedAppointments = await this.prisma.appointment.findMany({
          where: {
            doctorId,
            appointmentDate: currentDate,
            status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW] }
          }
        });
        const bookedTimes = bookedAppointments.map(a => {
          const h = a.appointmentTime.getUTCHours().toString().padStart(2, '0');
          const m = a.appointmentTime.getUTCMinutes().toString().padStart(2, '0');
          return `${h}:${m}`;
        });
        
        // Find the first slot that isn't booked
        const availableSlot = possibleSlots.find(slot => !bookedTimes.includes(slot));
        
        if (availableSlot) {
          return { date: new Date(currentDate), time: availableSlot };
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return null; // Could not find an available slot in the next 30 days
  }

  private async resolveScheduleConflicts(doctorProfileId: string) {
    const futureAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctorProfileId,
        status: 'SCHEDULED',
        appointmentDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        }
      },
      include: { patient: true }
    });

    if (futureAppointments.length === 0) return;

    const allShifts = await this.prisma.doctorShift.findMany({
      where: { doctorId: doctorProfileId }
    });

    console.log(`Checking ${futureAppointments.length} future appointments for conflicts...`);

    for (const appt of futureAppointments) {
      const dayOfWeek = appt.appointmentDate.getDay();
      const shiftsForDay = allShifts.filter(s => s.dayOfWeek === dayOfWeek);
      const validSlots = this.generateSlotsForShifts(shiftsForDay);

      const apptTimeStr = `${appt.appointmentTime.getUTCHours().toString().padStart(2, '0')}:${appt.appointmentTime.getUTCMinutes().toString().padStart(2, '0')}`;

      if (!validSlots.includes(apptTimeStr)) {
        console.log(`Conflict detected for appointment ID: ${appt.id} on ${appt.appointmentDate.toLocaleDateString()} at ${apptTimeStr}`);
        
        const newSlot = await this.findNextAvailableSlot(doctorProfileId, appt.appointmentDate, allShifts);
        
        if (newSlot) {
          await this.prisma.appointment.update({
            where: { id: appt.id },
            data: {
              appointmentDate: newSlot.date,
              appointmentTime: new Date(`1970-01-01T${newSlot.time}:00.000Z`)
            }
          });

          if (appt.patient.mobile) {
            await this.smsWhatsappService.sendSms({
              recipient: appt.patient.mobile,
              content: `Alert: Your appointment originally on ${appt.appointmentDate.toLocaleDateString()} at ${apptTimeStr} has been automatically rescheduled to ${newSlot.date.toLocaleDateString()} at ${newSlot.time} due to a change in the doctor's schedule. Please contact us if you need to change this time.`,
              patientId: appt.patient.id,
            });
          }
        } else {
          // Fallback: Cancel if no slot found
          await this.prisma.appointment.update({
            where: { id: appt.id },
            data: { status: 'CANCELLED' }
          });

          if (appt.patient.mobile) {
            await this.smsWhatsappService.sendSms({
              recipient: appt.patient.mobile,
              content: `Alert: Your appointment on ${appt.appointmentDate.toLocaleDateString()} at ${apptTimeStr} has been cancelled due to a change in the doctor's schedule and no available slots within 30 days. Please contact us to re-book.`,
              patientId: appt.patient.id,
            });
          }
        }
      }
    }
  }

  async getLeaves(id: string) {
    return this.prisma.doctorLeave.findMany({
      where: { doctorId: id },
      orderBy: { startDate: 'desc' },
    });
  }

  async addLeave(id: string, branchId: string, leaveDto: CreateDoctorLeaveDto) {
    const leave = await this.prisma.doctorLeave.create({
      data: {
        doctorId: id,
        startDate: new Date(leaveDto.startDate),
        endDate: new Date(leaveDto.endDate),
        reason: leaveDto.reason,
        status: 'APPROVED',
      },
    });

    // Alert affected patients
    const affectedAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: id,
        status: 'SCHEDULED',
        appointmentDate: {
          gte: new Date(leaveDto.startDate),
          lte: new Date(leaveDto.endDate),
        },
      },
      include: { patient: true },
    });

    for (const appt of affectedAppointments) {
      if (appt.patient.mobile) {
        await this.smsWhatsappService.sendSms({
          recipient: appt.patient.mobile,
          content: `Alert: Your appointment on ${appt.appointmentDate.toLocaleDateString()} has been cancelled as the doctor is on leave. Please reschedule.`,
          patientId: appt.patient.id,
        });
        
        await this.prisma.appointment.update({
          where: { id: appt.id },
          data: { status: 'CANCELLED' }
        });
      }
    }

    return leave;
  }

  async removeLeave(id: string, leaveId: string) {
    return this.prisma.doctorLeave.delete({
      where: { id: leaveId, doctorId: id },
    });
  }
}
