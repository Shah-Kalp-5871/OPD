import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class FileSecurityService {
  private readonly secretKey = process.env.JWT_SECRET || 'medflow_secure_file_upload_token_2026';

  /**
   * Validates file headers (magic numbers) to ensure file content matches the declared MIME type.
   */
  validateMagicHeader(buffer: Buffer, declaredMimetype: string): boolean {
    if (buffer.length < 4) return false;

    const hex = buffer.toString('hex', 0, 4).toUpperCase();

    switch (declaredMimetype) {
      case 'application/pdf':
        // PDF files start with %PDF (hex: 25504446)
        return hex.startsWith('25504446');
      case 'image/png':
        // PNG starts with hex: 89504E47
        return hex === '89504E47';
      case 'image/jpeg':
        // JPEG starts with hex: FFD8FF
        return hex.startsWith('FFD8FF');
      default:
        return false;
    }
  }

  /**
   * Advanced Antivirus sandbox scan abstraction.
   * Scans for the standard EICAR test string and malicious macro scripts.
   */
  async scanForMalware(buffer: Buffer, filename: string): Promise<{ safe: boolean; reason?: string }> {
    const fileContent = buffer.toString('utf-8');

    // EICAR Standard Antivirus Test Signature check
    if (fileContent.includes('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*')) {
      return { safe: false, reason: 'Malicious threat signature detected: EICAR-Test-File' };
    }

    // PDF specific exploit scans: active scripts/javascript blocks inside document
    if (filename.toLowerCase().endsWith('.pdf') && fileContent.includes('/JS') && fileContent.includes('/JavaScript')) {
      return { safe: false, reason: 'Malicious threat signature detected: Active PDF Script Macro' };
    }

    // Image-embedded binary executable scans
    if (fileContent.includes('<?php') || fileContent.includes('eval(')) {
      return { safe: false, reason: 'Malicious threat signature detected: Web shell scripting pattern' };
    }

    // Simulate clean scan
    return { safe: true };
  }

  /**
   * Generates a cryptographically signed upload URL for secure, limited-time client-side file upload.
   */
  async generateSignedUploadUrl(
    folder: string,
    filename: string,
    expiresMinutes = 15,
  ): Promise<{ uploadUrl: string; expiresAt: number }> {
    const expiresAt = Date.now() + expiresMinutes * 60 * 1000;
    const dataToSign = `${folder}/${filename}:${expiresAt}`;
    
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataToSign)
      .digest('hex');

    const uploadUrl = `/api/files/signed-upload?folder=${encodeURIComponent(
      folder,
    )}&filename=${encodeURIComponent(filename)}&expires=${expiresAt}&signature=${signature}`;

    return { uploadUrl, expiresAt };
  }

  /**
   * Verifies the signature and validity of a signed upload URL.
   */
  verifySignedUploadUrl(
    folder: string,
    filename: string,
    expires: string,
    signature: string,
  ): boolean {
    const expiresTimestamp = parseInt(expires, 10);
    
    // Check expiration
    if (isNaN(expiresTimestamp) || Date.now() > expiresTimestamp) {
      throw new BadRequestException('Signed upload link has expired');
    }

    const dataToSign = `${folder}/${filename}:${expires}`;
    const computedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataToSign)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));
  }
}
