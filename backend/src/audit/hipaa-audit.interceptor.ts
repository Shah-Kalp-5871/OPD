import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { HIPAA_AUDIT_KEY, HipaaAuditOptions } from './hipaa-audit.decorator';

@Injectable()
export class HipaaAuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.getAllAndOverride<HipaaAuditOptions>(HIPAA_AUDIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const user = req.user;

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log successful access asynchronously without blocking the client response
          this.logAuditEvent(req, user, options, data, 'SUCCESS').catch((err) => {
            console.error('Failed to write HIPAA audit log:', err);
          });
        },
        error: (error) => {
          // Log failed access attempts/violations
          this.logAuditEvent(req, user, options, null, 'FAILED', error.message).catch((err) => {
            console.error('Failed to write HIPAA audit log for error:', err);
          });
        },
      }),
    );
  }

  private async logAuditEvent(
    req: any,
    user: any,
    options: HipaaAuditOptions,
    responseData: any,
    status: 'SUCCESS' | 'FAILED',
    errorMessage?: string,
  ): Promise<void> {
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Agent';

    // Auto-resolve patientId and entityId from parameters or request body
    const patientId = req.params?.patientId || req.body?.patientId || req.query?.patientId || null;
    const entityId = req.params?.id || req.params?.billId || req.params?.prescriptionId || req.body?.id || null;
    
    // Determine entity type based on module
    let entityType = options.module;
    if (options.module === 'PATIENTS') {
      entityType = 'Patient';
    } else if (options.module === 'PRESCRIPTIONS') {
      entityType = 'Prescription';
    } else if (options.module === 'BILLING') {
      entityType = 'Bill';
    }

    let resolvedPatientId = patientId;
    // Fallback patient resolution from response payload if present
    if (!resolvedPatientId && responseData) {
      resolvedPatientId = responseData.patientId || responseData.patient?.id || null;
    }

    let detailsStr = `Status: ${status}`;
    if (status === 'FAILED' && errorMessage) {
      detailsStr += ` | Error: ${errorMessage}`;
    }
    
    // Add additional action details
    if (req.method) {
      detailsStr += ` | Method: ${req.method} | URL: ${req.originalUrl || req.url}`;
    }

    await this.auditService.logEvent({
      userId: user?.id || null,
      role: user?.role || null,
      branchId: user?.branchId || req.headers['x-branch-id'] || null,
      patientId: resolvedPatientId,
      actionType: status === 'FAILED' && options.actionType === 'LOGIN_SUCCESS' ? 'LOGIN_FAILED' : options.actionType,
      module: options.module,
      ipAddress,
      userAgent,
      entityType,
      entityId,
      details: detailsStr,
    });
  }
}
