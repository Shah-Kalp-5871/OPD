import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

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
            availableDays: createDoctorDto.availableDays,
            morningStart: createDoctorDto.morningStart,
            morningEnd: createDoctorDto.morningEnd,
            eveningStart: createDoctorDto.eveningStart,
            eveningEnd: createDoctorDto.eveningEnd,
            appointmentGap: createDoctorDto.appointmentGap,
            slotDuration: createDoctorDto.slotDuration,
          },
        },
      },
      include: {
        doctorProfile: true,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const doctors = await this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      include: {
        doctorProfile: true,
      },
    });

    return doctors.map(({ password, ...user }) => user);
  }

  async findOne(id: string) {
    const doctor = await this.prisma.user.findFirst({
      where: { id, role: Role.DOCTOR },
      include: {
        doctorProfile: true,
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
            availableDays: updateDoctorDto.availableDays,
            morningStart: updateDoctorDto.morningStart,
            morningEnd: updateDoctorDto.morningEnd,
            eveningStart: updateDoctorDto.eveningStart,
            eveningEnd: updateDoctorDto.eveningEnd,
            appointmentGap: updateDoctorDto.appointmentGap,
            slotDuration: updateDoctorDto.slotDuration,
          },
        },
      },
      include: {
        doctorProfile: true,
      },
    });

    const { password, ...result } = updatedUser;
    return result;
  }
}
