import { Test, TestingModule } from '@nestjs/testing';
import { TelemedicineAuthorizationService } from './telemedicine-authorization.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('TelemedicineAuthorizationService', () => {
  let service: TelemedicineAuthorizationService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      read: {
        appointment: {
          findUnique: jest.fn(),
        },
        bill: {
          findFirst: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemedicineAuthorizationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TelemedicineAuthorizationService>(TelemedicineAuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authorizeRoomAccess', () => {
    const userId = 'user-123';
    const appointmentId = 'appointment-123';
    const userRole = 'PATIENT';

    it('should throw NotFoundException if appointment does not exist', async () => {
      prismaMock.read.appointment.findUnique.mockResolvedValue(null);

      await expect(
        service.authorizeRoomAccess(userId, userRole, appointmentId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if appointment is cancelled', async () => {
      prismaMock.read.appointment.findUnique.mockResolvedValue({
        id: appointmentId,
        status: AppointmentStatus.CANCELLED,
      });

      await expect(
        service.authorizeRoomAccess(userId, userRole, appointmentId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user is neither patient nor doctor', async () => {
      prismaMock.read.appointment.findUnique.mockResolvedValue({
        id: appointmentId,
        status: AppointmentStatus.SCHEDULED,
        patientId: 'another-patient',
        doctor: { userId: 'another-doctor' },
      });

      await expect(
        service.authorizeRoomAccess(userId, userRole, appointmentId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if too early to join', async () => {
      const futureTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      prismaMock.read.appointment.findUnique.mockResolvedValue({
        id: appointmentId,
        status: AppointmentStatus.SCHEDULED,
        patientId: userId,
        doctor: { userId: 'doctor-id' },
        appointmentTime: futureTime,
      });

      await expect(
        service.authorizeRoomAccess(userId, userRole, appointmentId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should authorize access if patient is FOC', async () => {
      const nearFutureTime = new Date(Date.now() + 5 * 60 * 1000); // 5 mins from now
      prismaMock.read.appointment.findUnique.mockResolvedValue({
        id: appointmentId,
        status: AppointmentStatus.SCHEDULED,
        patientId: userId,
        doctor: { userId: 'doctor-id' },
        appointmentTime: nearFutureTime,
        patient: { isFoc: true },
      });

      const result = await service.authorizeRoomAccess(userId, userRole, appointmentId);
      expect(result).toBe(true);
    });

    it('should authorize access if successful payment intent is present', async () => {
      const nearFutureTime = new Date(Date.now() + 5 * 60 * 1000);
      prismaMock.read.appointment.findUnique.mockResolvedValue({
        id: appointmentId,
        status: AppointmentStatus.SCHEDULED,
        patientId: userId,
        doctor: { userId: 'doctor-id' },
        appointmentTime: nearFutureTime,
        patient: { isFoc: false },
        paymentIntent: { status: 'SUCCEEDED' },
      });

      const result = await service.authorizeRoomAccess(userId, userRole, appointmentId);
      expect(result).toBe(true);
    });

    it('should authorize access if paid bill is present', async () => {
      const nearFutureTime = new Date(Date.now() + 5 * 60 * 1000);
      prismaMock.read.appointment.findUnique.mockResolvedValue({
        id: appointmentId,
        status: AppointmentStatus.SCHEDULED,
        patientId: userId,
        doctor: { userId: 'doctor-id' },
        appointmentTime: nearFutureTime,
        patient: { isFoc: false },
        caseId: 'case-id',
      });

      prismaMock.read.bill.findFirst.mockResolvedValue({
        id: 'bill-id',
        paymentStatusEnum: 'PAID',
      });

      const result = await service.authorizeRoomAccess(userId, userRole, appointmentId);
      expect(result).toBe(true);
      expect(prismaMock.read.bill.findFirst).toHaveBeenCalledWith({
        where: {
          caseId: 'case-id',
          paymentStatusEnum: { in: ['PAID', 'FOC'] },
        },
      });
    });
  });
});
