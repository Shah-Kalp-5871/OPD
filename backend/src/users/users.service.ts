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
        branchAccess: true,
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async incrementFailedAttempts(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const newAttempts = user.failedLoginAttempts + 1;
    const lockDuration = 15 * 60 * 1000; // 15 minutes
    const lockedUntil =
      newAttempts >= 5 ? new Date(Date.now() + lockDuration) : null;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil,
      },
    });
  }

  async resetFailedAttempts(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async updateMfa(userId: string, data: { mfaSecret?: string | null; mfaEnabled?: boolean; mfaBackupCodes?: string | null }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updatePermissions(userId: string, permissions: string[]) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { permissions },
    });
  }
}
