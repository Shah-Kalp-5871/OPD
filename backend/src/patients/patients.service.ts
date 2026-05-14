import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { AddVitalsDto } from './dto/add-vitals.dto';
import { CreateCaseDto } from './dto/create-case.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    // Check if patient with same mobile already exists
    const existingPatient = await this.prisma.patient.findUnique({
      where: { mobile: createPatientDto.mobile },
    });

    if (existingPatient) {
      throw new ConflictException('Patient with this mobile number already exists');
    }

    // Generate MRD Number: MRD-YYYY-NNNN
    const mrdNumber = await this.generateMrdNumber();

    const patient = await this.prisma.patient.create({
      data: {
        ...createPatientDto,
        mrdNumber,
        profile: {
          create: {}, // Create empty profile
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

    if (updateDto.mobile && updateDto.mobile !== patient.mobile) {
      const existing = await this.prisma.patient.findUnique({ where: { mobile: updateDto.mobile } });
      if (existing) throw new ConflictException('Mobile number already in use');
    }

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

  async findAll(query: string = '', page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const where: any = query ? {
      OR: [
        { mrdNumber: { contains: query, mode: 'insensitive' } },
        { mobile: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ],
    } : {};

    const [total, patients] = await Promise.all([
      this.prisma.patient.count({ where }),
      this.prisma.patient.findMany({
        where,
        include: {
          profile: true,
          cases: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { createdAt: true }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: patients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        profile: true,
        vitals: {
          orderBy: { takenAt: 'desc' },
          take: 10,
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
                    specialization: true
                  }
                }
              }
            }
          }
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
      'dob', 'age', 'bloodGroup', 'address', 'city', 
      'state', 'occupation', 'maritalStatus', 'allergies', 'emergencyContact'
    ];
    
    let completedFields = 0;
    for (const field of fieldsToCheck) {
      if (profile[field]) completedFields++;
    }
    
    // Base 20% (registration) + up to 80% more (8% per field for 10 fields)
    const completion = Math.min(100, 20 + (completedFields * 8));

    await this.prisma.patient.update({
      where: { id },
      data: { profileCompletionStatus: completion },
    });

    return profile;
  }

  async addVitals(id: string, vitalsDto: AddVitalsDto, userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    // Auto-calculate BMI if height and weight present
    let bmi: number | undefined = undefined;
    if (vitalsDto.height && vitalsDto.weight) {
      const heightInMeters = vitalsDto.height / 100;
      bmi = parseFloat((vitalsDto.weight / (heightInMeters * heightInMeters)).toFixed(2));
    }

    return this.prisma.patientVitals.create({
      data: {
        ...vitalsDto,
        bmi: bmi || vitalsDto.bmi,
        patientId: id,
        takenById: userId,
      },
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

  async createCase(patientId: string, createCaseDto: CreateCaseDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) throw new NotFoundException('Patient not found');

    // Check for existing OPEN case
    const activeCase = await this.prisma.patientCase.findFirst({
      where: { patientId, status: 'OPEN' },
    });
    
    if (activeCase) {
      return activeCase;
    }

    const caseNumber = await this.generateCaseNumber();

    return this.prisma.patientCase.create({
      data: {
        ...createCaseDto,
        caseNumber,
        patientId,
        status: 'OPEN',
      },
    });
  }

  private async generateCaseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CASE-${year}-`;
    
    const lastCase = await this.prisma.patientCase.findFirst({
      where: {
        caseNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        caseNumber: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastCase) {
      const lastNumberStr = lastCase.caseNumber.split('-')[2];
      nextNumber = parseInt(lastNumberStr, 10) + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  }
}
