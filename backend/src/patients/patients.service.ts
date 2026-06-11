import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../common/events.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { AddVitalsDto } from './dto/add-vitals.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { PatientQueryDto } from './dto/patient-query.dto';
import { AddPatientDocumentDto } from './dto/add-document.dto';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private events: EventsService,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    // Generate MRD Number: MRD-YYYY-NNNN
    const mrdNumber = await this.generateMrdNumber();

    // Handle DOB and Age calculation
    let dobDate: Date | undefined = undefined;
    let computedAge: number | undefined = createPatientDto.age;

    if (createPatientDto.dob) {
      dobDate = new Date(createPatientDto.dob);
      if (!computedAge) {
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        computedAge = age;
      }
    }

    const { dob, age, ageMonths, ageDays, ...patientData } = createPatientDto;

    const patient = await this.prisma.patient.create({
      data: {
        ...patientData,
        mrdNumber,
        profile: {
          create: {
            dob: dobDate,
            age: computedAge,
            ageMonths,
            ageDays,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return patient;
  }

  async update(id: string, updateDto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    return this.prisma.patient.update({
      where: { id },
      data: updateDto,
    });
  }

  public async generateMrdNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `MRD-${year}-`;

    const lastPatient = await this.prisma.patient.findFirst({
      where: {
        mrdNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        mrdNumber: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastPatient) {
      const lastNumberStr = lastPatient.mrdNumber.split('-')[2];
      nextNumber = parseInt(lastNumberStr, 10) + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }

  async findAll(queryDto: PatientQueryDto) {
    const {
      q,
      page = 1,
      limit = 20,
      gender,
      minAge,
      maxAge,
      startDate,
      endDate,
      isActive,
      doctorId,
    } = queryDto;

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [],
    };

    if (q) {
      where.AND.push({
        OR: [
          { mrdNumber: { contains: q, mode: 'insensitive' } },
          { mobile: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    if (gender) {
      where.AND.push({ gender: { equals: gender, mode: 'insensitive' } });
    }

    if (isActive !== undefined) {
      where.AND.push({ isActive });
    }

    if (minAge !== undefined || maxAge !== undefined) {
      where.AND.push({
        profile: {
          age: {
            gte: minAge,
            lte: maxAge,
          },
        },
      });
    }

    if (startDate || endDate) {
      where.AND.push({
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      });
    }

    if (doctorId) {
      where.AND.push({
        cases: {
          some: {
            doctorId: doctorId,
          },
        },
      });
    }

    // If AND is empty, remove it to avoid Prisma issues or just use {}
    const finalWhere = where.AND.length > 0 ? where : {};

    const [total, patients] = await Promise.all([
      this.prisma.patient.count({ where: finalWhere }),
      this.prisma.patient.findMany({
        where: finalWhere,
        include: {
          profile: true,
          cases: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { createdAt: true, doctor: { select: { name: true } } },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      items: patients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, branchId?: string, userId?: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        profile: true,
        vitals: {
          orderBy: { takenAt: 'desc' },
          take: 10,
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        cases: {
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: {
              select: {
                id: true,
                name: true,
                doctorProfile: {
                  select: {
                    specialization: true,
                  },
                },
              },
            },
            queueEntry: true,
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async findByMrd(mrd: string, branchId?: string, userId?: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { mrdNumber: mrd },
      include: {
        profile: true,
        vitals: {
          orderBy: { takenAt: 'desc' },
          take: 10,
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        cases: {
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: {
              select: {
                id: true,
                name: true,
                doctorProfile: {
                  select: {
                    specialization: true,
                  },
                },
              },
            },
            queueEntry: true,
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async updateProfile(id: string, updateDto: UpdatePatientProfileDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    const updateData: any = { ...updateDto };

    // Handle Date conversion
    if (updateDto.dob) {
      updateData.dob = new Date(updateDto.dob);

      // Auto-calculate age if not provided
      if (!updateDto.age) {
        const birthDate = new Date(updateDto.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        updateData.age = age;
      }
    }

    const profile = await this.prisma.patientProfile.update({
      where: { patientId: id },
      data: updateData,
    });

    // Simple completion logic
    // Fields to check for completion (excluding notes and photo)
    const fieldsToCheck = [
      'dob',
      'age',
      'bloodGroup',
      'address',
      'city',
      'state',
      'occupation',
      'maritalStatus',
      'allergies',
      'emergencyContact',
    ];

    let completedFields = 0;
    for (const field of fieldsToCheck) {
      if (profile[field]) completedFields++;
    }

    // Base 20% (registration) + up to 80% more (8% per field for 10 fields)
    const completion = Math.min(100, 20 + completedFields * 8);

    await this.prisma.patient.update({
      where: { id },
      data: { profileCompletionStatus: completion },
    });

    return profile;
  }

  async addVitals(
    id: string,
    vitalsDto: AddVitalsDto,
    userId: string,
    branchId: string,
  ) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    // Auto-calculate BMI if height and weight present
    let bmi: number | undefined = undefined;
    if (vitalsDto.height && vitalsDto.weight) {
      const heightInMeters = vitalsDto.height / 100;
      bmi = parseFloat(
        (vitalsDto.weight / (heightInMeters * heightInMeters)).toFixed(2),
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const vitals = await tx.patientVitals.create({
        data: {
          ...vitalsDto,
          bmi: bmi || vitalsDto.bmi,
          patientId: id,
          takenById: userId,
          branchId,
        },
      });

      if (vitalsDto.caseId) {
        // Update case stage to DOCTOR as vitals are now taken
        await tx.patientCase.update({
          where: { id: vitalsDto.caseId },
          data: { stage: 'DOCTOR' },
        });

        // Also update queue entry if exists
        const queueEntry = await tx.queueEntry.findUnique({
          where: { caseId: vitalsDto.caseId },
          include: { patient: true },
        });

        if (queueEntry) {
          // Notify via SSE
          this.events.emitClinicalUpdate({
            type: 'VITALS_SAVED',
            patientId: id,
            caseId: vitalsDto.caseId,
            patientName: `${queueEntry.patient.firstName} ${queueEntry.patient.lastName}`,
            vitals: vitals,
          });
        }
      }

      return vitals;
    });
  }

  async getVitalsHistory(id: string) {
    return this.prisma.patientVitals.findMany({
      where: { patientId: id },
      orderBy: { takenAt: 'desc' },
      include: {
        takenBy: {
          select: { name: true },
        },
      },
    });
  }

  async getHistory(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    return this.prisma.patientCase.findMany({
      where: { patientId: id },
      include: {
        doctor: { select: { name: true } },
        consultation: true,
        vitalsList: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBilling(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    return this.prisma.bill.findMany({
      where: { patientId: id },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAppointments(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    return this.prisma.appointment.findMany({
      where: { patientId: id },
      include: {
        doctor: {
          select: {
            user: { select: { name: true } },
            specialization: true,
          },
        },
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  async createCase(
    patientId: string,
    createCaseDto: CreateCaseDto,
    branchId: string,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) throw new NotFoundException('Patient not found');

    // Check for existing OPEN case
    const activeCase = await this.prisma.patientCase.findFirst({
      where: { patientId, branchId, status: 'OPEN' },
    });

    if (activeCase) {
      return activeCase;
    }

    const caseNumber = await this.generateCaseNumber(branchId);

    return this.prisma.patientCase.create({
      data: {
        ...createCaseDto,
        branchId,
        caseNumber,
        patientId,
        status: 'OPEN',
      },
    });
  }

  /**
   * GENERATE UNIQUE CASE NUMBER
   */
  async generateCaseNumber(branchId: string): Promise<string> {
    const today = new Date();
    const dateStr =
      today.getFullYear().toString().slice(-2) +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      today.getDate().toString().padStart(2, '0');

    const count = await this.prisma.patientCase.count({
      where: {
        branchId,
        caseNumber: {
          startsWith: `C${dateStr}`,
        },
      },
    });

    return `C${dateStr}${(count + 1).toString().padStart(4, '0')}`;
  }

  async addDocument(patientId: string, dto: AddPatientDocumentDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundException('Patient not found');

    return this.prisma.patientDocument.create({
      data: {
        patientId,
        documentType: dto.documentType,
        documentNumber: dto.documentNumber,
        labName: dto.labName,
        reportDate: dto.reportDate ? new Date(dto.reportDate) : undefined,
        fileUrl: dto.fileUrl,
      },
    });
  }

  async deleteDocument(patientId: string, docId: string) {
    const document = await this.prisma.patientDocument.findUnique({ where: { id: docId } });
    if (!document || document.patientId !== patientId) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.patientDocument.delete({ where: { id: docId } });
  }
}
