import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class MfaService {
  /**
   * Generates a secure, random base32 encoded secret key
   */
  generateSecret(email: string, issuer: string = 'MedFlow-OPD'): { secret: string; otpauthUrl: string } {
    // Generate 20 random bytes
    const buffer = crypto.randomBytes(20);
    const secret = this.base32Encode(buffer);
    
    // Format dynamic otpauth URL for Google Authenticator QR scanner
    const encodedUser = encodeURIComponent(email);
    const encodedIssuer = encodeURIComponent(issuer);
    const otpauthUrl = `otpauth://totp/${encodedIssuer}:${encodedUser}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;

    return { secret, otpauthUrl };
  }

  /**
   * Verifies if a given TOTP token is valid for a secret
   */
  verifyToken(secret: string, token: string, window: number = 1): boolean {
    if (!token || token.length !== 6 || isNaN(Number(token))) {
      return false;
    }

    try {
      const keyBytes = this.base32Decode(secret);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeStep = 30;

      // Check current window and surrounding drift bounds
      for (let i = -window; i <= window; i++) {
        const timeIndex = Math.floor(currentTime / timeStep) + i;
        const generatedToken = this.generateTotp(keyBytes, timeIndex);
        if (generatedToken === token) {
          return true;
        }
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  /**
   * Generates 10 secure, single-use dynamic backup codes
   */
  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // 8-character hex code
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  // ── Helper Math Functions ──────────────────────────────────────────────────
  
  private base32Encode(buffer: Buffer): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;

      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31];
    }

    return output;
  }

  private base32Decode(str: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleanStr = str.replace(/=+$/, '').toUpperCase();
    const bytes: number[] = [];
    let bits = 0;
    let value = 0;

    for (let i = 0; i < cleanStr.length; i++) {
      const index = alphabet.indexOf(cleanStr[i]);
      if (index === -1) {
        throw new BadRequestException('Invalid base32 character');
      }

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return Buffer.from(bytes);
  }

  private generateTotp(keyBytes: Buffer, timeIndex: number): string {
    // 8-byte time counter buffer
    const buffer = Buffer.alloc(8);
    let tempTime = timeIndex;
    for (let i = 7; i >= 0; i--) {
      buffer[i] = tempTime & 0xff;
      tempTime = tempTime >> 8;
    }

    // HMAC-SHA1 calculation
    const hmac = crypto.createHmac('sha1', keyBytes);
    hmac.update(buffer);
    const hmacResult = hmac.digest();

    // Dynamic Truncation
    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const codeBinary =
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);

    const otp = codeBinary % 1000000;
    return otp.toString().padStart(6, '0');
  }
}
