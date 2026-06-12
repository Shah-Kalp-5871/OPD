import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckInMrDto } from './dto/checkin-mr.dto';
import { QueueStatus } from '@prisma/client';

@Injectable()
export class MedicalRepresentativesService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(dto: CheckInMrDto, branchId: string) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Find or create the MR
      let mr = await tx.medicalRepresentative.findUnique({
        where: { mobile: dto.mobile }
      });

      if (!mr) {
        mr = await tx.medicalRepresentative.create({
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            mobile: dto.mobile,
            companyName: dto.companyName,
          }
        });
      } else {
        if (dto.companyName && mr.companyName !== dto.companyName) {
          mr = await tx.medicalRepresentative.update({
            where: { id: mr.id },
            data: { companyName: dto.companyName }
          });
        }
      }

      // 2. Verify doctor profile exists
      const doctorProfile = await tx.doctorProfile.findFirst({
        where: { 
          OR: [
            { id: dto.doctorId },
            { userId: dto.doctorId }
          ]
        },
        include: { user: true }
      });

      if (!doctorProfile || !doctorProfile.user) {
        throw new BadRequestException('Doctor not found');
      }

      const doctorUser = doctorProfile.user;

      // 3. Create MrVisit
      const mrVisit = await tx.mrVisit.create({
        data: {
          mrId: mr.id,
          doctorId: doctorUser.id,
          branchId: branchId,
          status: 'OPEN',
        }
      });

      // 4. Block the slot for MR
      const slotDate = new Date();
      slotDate.setHours(0, 0, 0, 0);

      const [hours, minutes] = dto.appointmentTime.split(':').map(Number);
      const startTime = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
      
      const expectedTime = new Date();
      expectedTime.setHours(hours, minutes, 0, 0);
      const duration = doctorProfile.slotDuration || 15;
      const endTime = new Date(startTime.getTime() + duration * 60000);

      await tx.doctorBlockedSlot.create({
        data: {
          doctorId: doctorProfile.id,
          branchId: branchId,
          date: slotDate,
          startTime,
          endTime,
          reason: `MR Visit - ${mr.firstName} ${mr.lastName}`
        }
      });

      // 5. Generate Token — query BRANCH-WIDE max to avoid tokenDisplay unique constraint collisions
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const latestBranchQueue = await tx.queueEntry.findFirst({
        where: {
          branchId: branchId,
          checkInTime: { gte: todayStart }
        },
        orderBy: { tokenNumber: 'desc' }
      });

      const nextTokenNumber = (latestBranchQueue?.tokenNumber ?? 0) + 1;
      const docPrefix = doctorUser.name.substring(0, 3).toUpperCase();
      // Prefix MR- to distinguish from patient tokens and avoid any collisions
      const tokenDisplay = `MR-${docPrefix}-${nextTokenNumber}`;

      const queueEntry = await tx.queueEntry.create({
        data: {
          tokenDisplay,
          tokenNumber: nextTokenNumber,
          queueType: 'OPD',
          status: QueueStatus.WAITING,
          priority: 'NORMAL',
          mrId: mr.id,
          mrVisitId: mrVisit.id,
          doctorId: doctorUser.id,
          branchId: branchId,
          expectedTime: expectedTime,
        }
      });

      return {
        message: 'MR Check-in successful',
        mrVisit,
        queueEntry
      };
    });
  }

  async getAllMRs() {
    return this.prisma.medicalRepresentative.findMany({
      orderBy: { updatedAt: 'desc' }
    });
  }
}
