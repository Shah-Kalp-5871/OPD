import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsultationService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateConsultation(caseId: string, userId: string) {
    // Check if consultation already exists
    let consultation = await (this.prisma as any).consultationRecord.findUnique({
      where: { caseId },
      include: {
        complaint: true,
        history: true,
        case: {
          include: {
            patient: {
              include: {
                profile: true,
                vitals: {
                  orderBy: { takenAt: 'desc' },
                  take: 4
                }
              }
            }
          }
        },
        session: true
      }
    });

    if (!consultation) {
      // Find the active session for this case/doctor
      const activeSession = await this.prisma.visitSession.findFirst({
        where: { caseId, doctorId: userId, status: 'ACTIVE' }
      });

      // Create new draft consultation
      consultation = await (this.prisma as any).consultationRecord.create({
        data: {
          case: { connect: { id: caseId } },
          doctor: { connect: { id: userId } },
          session: activeSession ? { connect: { id: activeSession.id } } : undefined,
          status: 'DRAFT',
          complaint: { create: {} },
          history: { create: {} }
        },
        include: {
          complaint: true,
          history: true,
          case: {
            include: {
              patient: {
                include: {
                  profile: true,
                  vitals: {
                    orderBy: { takenAt: 'desc' },
                    take: 4
                  }
                }
              }
            }
          },
          session: true
        }
      });
    }

    return consultation;
  }

  async updateConsultation(caseId: string, data: any) {
    const consultation = await (this.prisma as any).consultationRecord.findUnique({
      where: { caseId }
    });

    if (!consultation) throw new NotFoundException('Consultation not found');

    const { complaint, history } = data;

    return this.prisma.$transaction(async (tx) => {
      if (complaint) {
        await (tx as any).complaintEntry.update({
          where: { consultationId: consultation.id },
          data: {
            chiefComplaint: complaint.chiefComplaint,
            duration: complaint.duration ? parseInt(complaint.duration) : null,
            durationType: complaint.durationType,
            severity: complaint.severity,
            onset: complaint.onset,
            aggravatingFactors: complaint.aggravatingFactors,
            relievingFactors: complaint.relievingFactors,
          }
        });
      }

      if (history) {
        await (tx as any).clinicalHistory.update({
          where: { consultationId: consultation.id },
          data: {
            pastHistory: history.pastHistory,
            personalHistory: history.personalHistory,
            surgicalHistory: history.surgicalHistory,
            familyHistory: history.familyHistory,
            obstetricHistory: history.obstetricHistory,
          }
        });
      }

      return (tx as any).consultationRecord.findUnique({
        where: { id: consultation.id },
        include: { complaint: true, history: true }
      });
    });
  }
}
