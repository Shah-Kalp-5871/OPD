import { SetMetadata } from '@nestjs/common';

export interface HipaaAuditOptions {
  actionType: string;
  module: string;
}

export const HIPAA_AUDIT_KEY = 'hipaa-audit-key';

export const HipaaAudit = (options: HipaaAuditOptions) => SetMetadata(HIPAA_AUDIT_KEY, options);
