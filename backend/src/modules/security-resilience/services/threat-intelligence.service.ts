import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class ThreatIntelligenceService {
  private readonly logger = new Logger(ThreatIntelligenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  // --- Threat Feeds ---
  async getFeeds() {
    const tenantId = this.getTenantId();
    let feeds = await this.prisma.threatFeed.findMany({
      where: { tenantId },
    });

    if (feeds.length === 0) {
      // Setup some default intelligence feeds
      await this.prisma.threatFeed.createMany({
        data: [
          { tenantId, feedName: 'AlienVault OTX IP Reputation', feedType: 'IP_BLACKLIST', isActive: true },
          { tenantId, feedName: 'HaveIBeenPwned Compromised Credentials', feedType: 'CREDENTIAL_LEAK', isActive: true },
          { tenantId, feedName: 'Abuse.ch Ransomware Tracker', feedType: 'IP_BLACKLIST', isActive: true },
        ],
      });
      feeds = await this.prisma.threatFeed.findMany({
        where: { tenantId },
      });
    }
    return feeds;
  }

  async syncFeeds() {
    const tenantId = this.getTenantId();
    // Simulate populating threat indicators from global security intelligence feeds
    const sampleIps = ['198.51.100.42', '203.0.113.195', '185.220.101.4'];
    for (const ip of sampleIps) {
      await this.prisma.maliciousIp.upsert({
        where: { ipAddress: ip },
        create: {
          tenantId,
          ipAddress: ip,
          threatType: 'TOR_EXIT',
          confidence: 95.0,
        },
        update: {
          confidence: 95.0,
        },
      });
    }

    const sampleHashes = [
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f',
    ];
    for (const hash of sampleHashes) {
      await this.prisma.malwareSignature.upsert({
        where: { fileHash: hash },
        create: {
          tenantId,
          fileHash: hash,
          malwareFamily: 'LockBit 3.0 Ransomware',
          severity: 'CRITICAL',
        },
        update: {
          malwareFamily: 'LockBit 3.0 Ransomware',
        },
      });
    }

    await this.prisma.threatFeed.updateMany({
      where: { tenantId },
      data: { lastSyncAt: new Date() },
    });

    return { success: true, syncedIpsCount: sampleIps.length, syncedSignaturesCount: sampleHashes.length };
  }

  // --- Compromised Credentials ---
  async getCompromisedCredentials() {
    const tenantId = this.getTenantId();
    return this.prisma.compromisedCredential.findMany({
      where: { tenantId },
      orderBy: { discoveredAt: 'desc' },
    });
  }

  async addCompromisedCredential(email: string, source?: string) {
    const tenantId = this.getTenantId();
    // Simple email hashing for PHI protection
    const crypto = require('crypto');
    const emailHash = crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');

    const exists = await this.prisma.compromisedCredential.findUnique({
      where: { emailHash },
    });

    if (exists) {
      return exists;
    }

    return this.prisma.compromisedCredential.create({
      data: {
        tenantId,
        emailHash,
        compromisedSource: source || 'DarkWeb Breach Dump',
      },
    });
  }

  // --- Blacklisted Malicious IPs ---
  async getMaliciousIps() {
    const tenantId = this.getTenantId();
    return this.prisma.maliciousIp.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- Malware Signatures ---
  async getMalwareSignatures() {
    const tenantId = this.getTenantId();
    return this.prisma.malwareSignature.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- Real-time Matching & Threat Indicators ---
  async inspectIp(ipAddress: string) {
    const tenantId = this.getTenantId();
    const match = await this.prisma.maliciousIp.findUnique({
      where: { ipAddress },
    });

    if (match) {
      await this.prisma.threatIntelMatch.create({
        data: {
          tenantId,
          matchedValue: ipAddress,
          matchType: 'IP_MATCH',
          severity: 'HIGH',
          details: { threatType: match.threatType, confidence: match.confidence },
        },
      });
      return { isMalicious: true, details: match };
    }
    return { isMalicious: false };
  }

  async inspectFileHash(fileHash: string) {
    const tenantId = this.getTenantId();
    const match = await this.prisma.malwareSignature.findUnique({
      where: { fileHash },
    });

    if (match) {
      await this.prisma.threatIntelMatch.create({
        data: {
          tenantId,
          matchedValue: fileHash,
          matchType: 'CREDENTIAL_MATCH', // Reused field
          severity: 'CRITICAL',
          details: { malwareFamily: match.malwareFamily },
        },
      });
      return { isMalicious: true, details: match };
    }
    return { isMalicious: false };
  }

  async getMatches() {
    const tenantId = this.getTenantId();
    return this.prisma.threatIntelMatch.findMany({
      where: { tenantId },
      orderBy: { matchedAt: 'desc' },
    });
  }
}
