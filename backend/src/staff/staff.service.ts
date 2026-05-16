import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(createStaffDto: CreateStaffDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createStaffDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createStaffDto.password, 10);

    const profileData: any = {
      salary: createStaffDto.salary,
      overtimeRate: createStaffDto.overtimeRate,
    };

    const user = await this.prisma.user.create({
      data: {
        name: createStaffDto.name,
        email: createStaffDto.email,
        password: hashedPassword,
        role: createStaffDto.role,
        isActive: createStaffDto.isActive ?? true,
        ...(createStaffDto.role === Role.RECEPTION && {
          receptionProfile: { create: profileData },
        }),
        ...(createStaffDto.role === Role.NURSING && {
          nurseProfile: { create: profileData },
        }),
        ...(createStaffDto.role === Role.MEDICAL && {
          medicalProfile: { create: profileData },
        }),
      },
      include: {
        receptionProfile: true,
        nurseProfile: true,
        medicalProfile: true,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll(params?: any) {
    const { search, page = 1, limit = 20, includeInactive = false } = params || {};
    const skip = (page - 1) * limit;

    const where: any = {
      role: {
        in: [Role.RECEPTION, Role.NURSING, Role.MEDICAL],
      },
      ...(!includeInactive && { isActive: true }),
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, staff] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          receptionProfile: true,
          nurseProfile: true,
          medicalProfile: true,
        },
      }),
    ]);

    const items = staff.map(({ password, ...user }) => user);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(id: string) {
    const staff = await this.prisma.user.findFirst({
      where: {
        id,
        role: {
          in: [Role.RECEPTION, Role.NURSING, Role.MEDICAL],
        },
      },
      include: {
        receptionProfile: true,
        nurseProfile: true,
        medicalProfile: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const { password, ...result } = staff;
    return result;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const updateData: any = {
      name: updateStaffDto.name,
      email: updateStaffDto.email,
      role: updateStaffDto.role,
      isActive: updateStaffDto.isActive,
    };

    if (updateStaffDto.password) {
      updateData.password = await bcrypt.hash(updateStaffDto.password, 10);
    }

    const profileUpdate: any = {
      update: {
        salary: updateStaffDto.salary,
        overtimeRate: updateStaffDto.overtimeRate,
      },
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(staff.role === Role.RECEPTION && {
          receptionProfile: profileUpdate,
        }),
        ...(staff.role === Role.NURSING && { nurseProfile: profileUpdate }),
        ...(staff.role === Role.MEDICAL && { medicalProfile: profileUpdate }),
      },
      include: {
        receptionProfile: true,
        nurseProfile: true,
        medicalProfile: true,
      },
    });

    const { password, ...result } = updatedUser;
    return result;
  }
}
