import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class RpmService {
  constructor(private readonly prisma: PrismaService) {}

  async enrollDevice(tenantId: string, patientId: string, deviceType: string, serialNumber: string, firmwareVersion?: string) {
    const pairingToken = crypto.randomBytes(24).toString('hex');
    return this.prisma.rpmDevice.create({
      data: { tenantId, patientId, deviceType, serialNumber, pairingToken, firmwareVersion },
    });
  }

  async getDevices(tenantId: string, patientId?: string) {
    return this.prisma.rpmDevice.findMany({
      where: { tenantId, ...(patientId ? { patientId } : {}), isActive: true },
    });
  }

  async ingestReading(tenantId: string, pairingToken: string, type: string, value: any, unit?: string) {
    const device = await this.prisma.rpmDevice.findFirst({ where: { pairingToken, tenantId, isActive: true } });
    if (!device) throw new NotFoundException('Device not found or inactive');

    const isAbnormal = this.detectAnomaly(type, value);

    await this.prisma.rpmDevice.update({ where: { id: device.id }, data: { lastSeenAt: new Date() } });

    const reading = await this.prisma.rpmReading.create({
      data: { deviceId: device.id, tenantId, patientId: device.patientId, type, value, unit, isAbnormal },
    });

    if (isAbnormal) await this.generateAlert(tenantId, device.patientId, reading.id, type, value);

    return reading;
  }

  private detectAnomaly(type: string, value: any): boolean {
    switch (type) {
      case 'SPO2': return typeof value === 'number' && value < 94;
      case 'GLUCOSE': return typeof value === 'number' && (value > 180 || value < 70);
      case 'HR': return typeof value === 'number' && (value > 100 || value < 50);
      case 'TEMP': return typeof value === 'number' && value > 38.5;
      default: return false;
    }
  }

  private async generateAlert(tenantId: string, patientId: string, readingId: string, type: string, value: any) {
    const alertTypeMap: Record<string, string> = {
      SPO2: 'LOW_SPO2', GLUCOSE: 'HIGH_GLUCOSE', HR: 'TACHYCARDIA', TEMP: 'FEVER',
    };
    const alertType = alertTypeMap[type] || 'ABNORMAL_READING';
    const severity = type === 'SPO2' && value < 90 ? 'CRITICAL' : 'WARNING';

    await this.prisma.rpmAlert.create({
      data: { tenantId, patientId, readingId, alertType, severity, message: `Abnormal ${type} reading: ${JSON.stringify(value)}` },
    });
  }

  async getAlerts(tenantId: string, patientId?: string) {
    return this.prisma.rpmAlert.findMany({
      where: { tenantId, ...(patientId ? { patientId } : {}), acknowledged: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acknowledgeAlert(tenantId: string, alertId: string, userId: string) {
    return this.prisma.rpmAlert.updateMany({
      where: { id: alertId, tenantId },
      data: { acknowledged: true, acknowledgedBy: userId },
    });
  }

  async revokeDevice(tenantId: string, deviceId: string) {
    return this.prisma.rpmDevice.updateMany({
      where: { id: deviceId, tenantId },
      data: { isActive: false },
    });
  }
}
