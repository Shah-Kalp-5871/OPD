import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFollowupDto } from './dto/create-followup.dto';
import { UpdateFollowupDto } from './dto/update-followup.dto';

@Injectable()
export class FollowupsService {
  constructor(private prisma: PrismaService) {}

  async create(createFollowupDto: CreateFollowupDto) {
    return this.prisma.followup.create({
      data: createFollowupDto,
    });
  }

  async findAll() {
    return this.prisma.followup.findMany({
      include: {
        patientCase: {
          include: {
            patient: true,
            doctor: true,
          }
        }
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findPending() {
    return this.prisma.followup.findMany({
      where: {
        status: { in: ['SCHEDULED', 'RESCHEDULED'] },
      },
      include: {
        patientCase: {
          include: {
            patient: true,
            doctor: true,
          }
        }
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async updateStatus(id: string, updateDto: UpdateFollowupDto, userId: string) {
    const followup = await this.prisma.followup.findUnique({ 
      where: { id },
      include: { patientCase: true }
    });
    if (!followup) throw new NotFoundException('Followup not found');

    const updated = await this.prisma.followup.update({
      where: { id },
      data: {
        status: updateDto.status,
        callOutcome: updateDto.callOutcome,
      },
    });

    if (updateDto.status === 'MISSED' || updateDto.callOutcome === 'Call not answered - F/U Missed') {
      // Auto populate special note for doctor
      await this.prisma.caseNote.create({
        data: {
          caseId: followup.caseId,
          noteText: 'F/U Missed: ' + (updateDto.callOutcome || 'Patient did not answer call'),
          authorId: userId,
          branchId: followup.patientCase.branchId,
        }
      });
    }

    return updated;
  }
}
