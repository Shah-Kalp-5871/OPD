import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterSmartAppDto, SmartLaunchDto } from './dto/smart-app.dto';
import * as crypto from 'crypto';

@Injectable()
export class SmartFhirService {
  constructor(private readonly prisma: PrismaService) {}

  async registerApp(tenantId: string, dto: RegisterSmartAppDto) {
    const clientId = crypto.randomUUID();
    const clientSecret = crypto.randomBytes(32).toString('hex');

    return this.prisma.smartApp.create({
      data: {
        tenantId,
        clientId,
        clientSecret,
        name: dto.name,
        description: dto.description,
        redirectUris: dto.redirectUris,
        scopes: dto.scopes,
        developerEmail: dto.developerEmail,
      },
    });
  }

  async getApps(tenantId: string) {
    return this.prisma.smartApp.findMany({ where: { tenantId } });
  }

  async createLaunchContext(tenantId: string, dto: SmartLaunchDto) {
    const app = await this.prisma.smartApp.findFirst({
      where: { id: dto.appId, tenantId },
    });

    if (!app) {
      throw new NotFoundException('SMART app not found');
    }

    const launchCode = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 minute launch window

    return this.prisma.smartLaunchContext.create({
      data: {
        tenantId,
        appId: dto.appId,
        launchCode,
        patientId: dto.patientId,
        encounterId: dto.encounterId,
        expiresAt,
      },
    });
  }
}
