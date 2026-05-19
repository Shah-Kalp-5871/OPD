import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class DeviceSecurityService {
  private readonly logger = new Logger(DeviceSecurityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  // --- Managed Devices (Endpoints) ---
  async getDevices() {
    const tenantId = this.getTenantId();
    let devices = await this.prisma.managedDevice.findMany({
      where: { tenantId },
    });

    if (devices.length === 0) {
      // Seed default active endpoint stations
      await this.prisma.managedDevice.createMany({
        data: [
          {
            tenantId,
            deviceName: 'OPD Reception Station 1',
            deviceType: 'NURSING_STATION',
            osVersion: 'Windows 11 Pro 23H2',
            antivirusStatus: 'COMPLIANT',
            diskEncrypted: true,
            complianceScore: 100.0,
          },
          {
            tenantId,
            deviceName: 'Dr. Kalp Consultation Tablet',
            deviceType: 'CLINICAL_TABLET',
            osVersion: 'iPadOS 17.4',
            antivirusStatus: 'COMPLIANT',
            diskEncrypted: true,
            complianceScore: 90.0,
          },
        ],
      });
      devices = await this.prisma.managedDevice.findMany({
        where: { tenantId },
      });
    }
    return devices;
  }

  async reportDeviceCompliance(deviceId: string, data: { policyName: string; passed: boolean; details?: string }) {
    const tenantId = this.getTenantId();
    const check = await this.prisma.deviceCompliance.create({
      data: {
        tenantId,
        deviceId,
        policyName: data.policyName,
        passed: data.passed,
        details: data.details,
      },
    });

    // Re-calculate compliance score
    const allChecks = await this.prisma.deviceCompliance.findMany({
      where: { tenantId, deviceId },
    });
    const passedCount = allChecks.filter(c => c.passed).length;
    const score = allChecks.length > 0 ? (passedCount / allChecks.length) * 100 : 100.0;

    await this.prisma.managedDevice.updateMany({
      where: { id: deviceId, tenantId },
      data: {
        complianceScore: score,
        antivirusStatus: score >= 90 ? 'COMPLIANT' : 'NON_COMPLIANT',
        lastSyncAt: new Date(),
      },
    });

    return check;
  }

  async getDeviceCompliances(deviceId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.deviceCompliance.findMany({
      where: { tenantId, deviceId },
      orderBy: { checkedAt: 'desc' },
    });
  }

  // --- Endpoint Threat Incidents ---
  async getDeviceIncidents() {
    const tenantId = this.getTenantId();
    return this.prisma.deviceSecurityIncident.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reportDeviceIncident(deviceId: string, data: { threatType: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }) {
    const tenantId = this.getTenantId();
    return this.prisma.deviceSecurityIncident.create({
      data: {
        tenantId,
        deviceId,
        threatType: data.threatType,
        severity: data.severity,
        status: 'ACTIVE',
      },
    });
  }

  // --- Biomedical Device Security ---
  async getBiomedicalDevices() {
    const tenantId = this.getTenantId();
    let biomeds = await this.prisma.biomedicalDeviceSecurity.findMany({
      where: { tenantId },
    });

    if (biomeds.length === 0) {
      await this.prisma.biomedicalDeviceSecurity.createMany({
        data: [
          {
            tenantId,
            assetId: 'BIO-ECG-9942',
            firmwareVersion: 'v2.4.1',
            isFirmwareSigned: true,
            insecureProtocols: ['TELNET'],
            threatScore: 15.0,
            status: 'SECURE',
          },
          {
            tenantId,
            assetId: 'BIO-INF-3301 (Infusion Pump)',
            firmwareVersion: 'v1.0.8',
            isFirmwareSigned: false,
            insecureProtocols: ['HTTP', 'FTP'],
            threatScore: 65.0,
            status: 'VULNERABLE',
          },
        ],
      });
      biomeds = await this.prisma.biomedicalDeviceSecurity.findMany({
        where: { tenantId },
      });
    }
    return biomeds;
  }

  async updateBiomedicalFirmware(assetId: string, data: { firmwareVersion: string; isFirmwareSigned: boolean }) {
    const tenantId = this.getTenantId();
    const device = await this.prisma.biomedicalDeviceSecurity.findFirst({
      where: { assetId, tenantId },
    });

    if (!device) {
      throw new NotFoundException(`Biomedical asset ${assetId} not found`);
    }

    let score = 0.0;
    if (!data.isFirmwareSigned) score += 40;
    if (device.insecureProtocols.length > 0) score += 25;

    return this.prisma.biomedicalDeviceSecurity.update({
      where: { id: device.id },
      data: {
        firmwareVersion: data.firmwareVersion,
        isFirmwareSigned: data.isFirmwareSigned,
        threatScore: score,
        status: score > 50 ? 'VULNERABLE' : 'SECURE',
        lastScanAt: new Date(),
      },
    });
  }
}
