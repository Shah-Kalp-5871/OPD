import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        adminProfile: true,
        receptionProfile: true,
        doctorProfile: true,
        nurseProfile: true,
        medicalProfile: true,
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        adminProfile: true,
        receptionProfile: true,
        doctorProfile: true,
        nurseProfile: true,
        medicalProfile: true,
      },
    });
  }
}

