import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Encrypt a plain text string using aes-256-cbc
 */
export function encryptText(text: string): string {
  if (!text) return '';
  const secretKey = process.env.ENCRYPTION_KEY || 'aSecureKeyMustBeExactly32Characters!';
  const key = crypto.scryptSync(secretKey, 'salt', 32);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt an encrypted text string using aes-256-cbc
 */
export function decryptText(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    const ivHex = parts.shift();
    if (!ivHex) return '';
    const encryptedHex = parts.join(':');

    const secretKey = process.env.ENCRYPTION_KEY || 'aSecureKeyMustBeExactly32Characters!';
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    // If decryption fails (e.g. text wasn't encrypted), return the original text as a fallback
    return encryptedText;
  }
}
