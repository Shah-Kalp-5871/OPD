import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';
import * as crypto from 'crypto';

@Injectable()
export class SecurityVaultService {
  private readonly logger = new Logger(SecurityVaultService.name);
  private readonly algorithm = 'aes-256-cbc';
  // 32-byte secret key fallback for encryption, ideally loaded from process.env.VAULT_MASTER_KEY
  private readonly masterKey = crypto.scryptSync(process.env.VAULT_MASTER_KEY || 'medflow-super-secret-vault-master-key-seed', 'salt', 32);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  // --- AES 256 Cryptography Helpers ---
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  private decrypt(hash: string): string {
    const parts = hash.split(':');
    if (parts.length !== 2) throw new Error('Invalid encrypted hash format');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // --- Vault Secret Management ---
  async getSecrets() {
    const tenantId = this.getTenantId();
    const secrets = await this.prisma.vaultSecret.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' },
    });
    // Mask values before returning to UI
    return secrets.map(sec => ({
      id: sec.id,
      secretName: sec.secretName,
      secretType: sec.secretType,
      rotationDays: sec.rotationDays,
      expiresAt: sec.expiresAt,
      createdAt: sec.createdAt,
      updatedAt: sec.updatedAt,
      encryptedValue: '••••••••••••••••' // Mask actual encrypted values for security
    }));
  }

  async storeSecret(data: { secretName: string; secretValue: string; secretType: string; rotationDays?: number }) {
    const tenantId = this.getTenantId();
    const encrypted = this.encrypt(data.secretValue);
    
    // Calculate expiration date
    const rotationDays = data.rotationDays || 90;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + rotationDays);

    const exists = await this.prisma.vaultSecret.findFirst({
      where: { tenantId, secretName: data.secretName },
    });

    if (exists) {
      return this.prisma.vaultSecret.update({
        where: { id: exists.id },
        data: {
          encryptedValue: encrypted,
          secretType: data.secretType,
          rotationDays,
          expiresAt,
        },
      });
    }

    return this.prisma.vaultSecret.create({
      data: {
        tenantId,
        secretName: data.secretName,
        encryptedValue: encrypted,
        secretType: data.secretType,
        rotationDays,
        expiresAt,
      },
    });
  }

  async revealSecret(secretId: string, userId: string, ipAddress?: string) {
    const tenantId = this.getTenantId();
    const secret = await this.prisma.vaultSecret.findFirst({
      where: { id: secretId, tenantId },
    });

    if (!secret) {
      throw new NotFoundException(`Secret ${secretId} not found`);
    }

    // Log the read access request for SOC compliance audit trail
    await this.prisma.secretAccessLog.create({
      data: {
        tenantId,
        secretId,
        userId,
        action: 'READ',
        ipAddress: ipAddress || 'Unknown',
      },
    });

    const decryptedValue = this.decrypt(secret.encryptedValue);
    return { secretName: secret.secretName, secretValue: decryptedValue };
  }

  async deleteSecret(secretId: string, userId: string, ipAddress?: string) {
    const tenantId = this.getTenantId();
    const secret = await this.prisma.vaultSecret.findFirst({
      where: { id: secretId, tenantId },
    });

    if (!secret) {
      throw new NotFoundException(`Secret ${secretId} not found`);
    }

    await this.prisma.secretAccessLog.create({
      data: {
        tenantId,
        secretId,
        userId,
        action: 'DELETE',
        ipAddress: ipAddress || 'Unknown',
      },
    });

    return this.prisma.vaultSecret.delete({
      where: { id: secretId },
    });
  }

  // --- Encryption Keys ---
  async getKeys() {
    const tenantId = this.getTenantId();
    let keys = await this.prisma.encryptionKey.findMany({
      where: { tenantId },
    });

    if (keys.length === 0) {
      // Create defaults
      await this.prisma.encryptionKey.createMany({
        data: [
          { tenantId, keyAlias: 'master-phi-key', keyType: 'AES_256', isActive: true, version: 1 },
          { tenantId, keyAlias: 'backup-dr-key', keyType: 'AES_256', isActive: true, version: 1 },
        ],
      });
      keys = await this.prisma.encryptionKey.findMany({
        where: { tenantId },
      });
    }
    return keys;
  }

  // --- Access Logs ---
  async getAccessLogs() {
    const tenantId = this.getTenantId();
    return this.prisma.secretAccessLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
