import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PERMISSIONS_KEY } from './permissions.decorator';

// Core Role-to-Permissions Mapping for Enterprise RBAC 2.0
export const ROLE_DEFAULT_PERMISSIONS: Record<Role, string[]> = {
  SUPERADMIN: ['*'], // Universal wild-card access
  ADMIN: [
    'READ_PATIENT',
    'WRITE_PATIENT',
    'READ_CLINICAL',
    'WRITE_CLINICAL',
    'BILLING_MANAGE',
    'ADMIN_SETTINGS',
    'AUDIT_VIEW',
    'ANALYTICS_VIEW',
    'SSO_MANAGE',
    'API_MANAGE',
  ],
  DOCTOR: [
    'READ_PATIENT',
    'WRITE_PATIENT',
    'READ_CLINICAL',
    'WRITE_CLINICAL',
    'TELEMEDICINE_START',
  ],
  NURSING: [
    'READ_PATIENT',
    'WRITE_PATIENT',
    'READ_CLINICAL',
    'WRITE_CLINICAL',
  ],
  PHARMACY: [
    'READ_PATIENT',
    'PHARMACY_DISPENSE',
  ],
  LAB_TECHNICIAN: [
    'READ_PATIENT',
    'LAB_REPORT_MANAGE',
  ],
  RECEPTION: [
    'READ_PATIENT',
    'WRITE_PATIENT',
  ],
  ACCOUNTANT: [
    'READ_PATIENT',
    'BILLING_MANAGE',
  ],
  MEDICAL: [
    'READ_PATIENT',
    'READ_CLINICAL',
  ],
  BRANCH_ADMIN: [
    'READ_PATIENT',
    'WRITE_PATIENT',
    'READ_CLINICAL',
    'WRITE_CLINICAL',
    'BILLING_MANAGE',
  ],
  CLINIC_MANAGER: [
    'READ_PATIENT',
    'WRITE_PATIENT',
    'READ_CLINICAL',
    'WRITE_CLINICAL',
    'BILLING_MANAGE',
    'ADMIN_SETTINGS',
  ],
  CENTRAL_FINANCE: [
    'BILLING_MANAGE',
    'ANALYTICS_VIEW',
  ],
  CENTRAL_PHARMACY: [
    'PHARMACY_DISPENSE',
    'READ_PATIENT',
  ],
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // 1. Resolve user's complete permissions set (Role defaults + User custom overrides)
    const roleDefaultPerms = ROLE_DEFAULT_PERMISSIONS[user.role as Role] || [];
    const customUserPerms = user.permissions || [];
    
    const userPermissionsSet = new Set<string>([...roleDefaultPerms, ...customUserPerms]);

    // 2. Superadmin bypass or universal permission matches
    if (userPermissionsSet.has('*') || user.role === 'SUPERADMIN') {
      return true;
    }

    // 3. Verify each required permission is present
    const hasPermission = requiredPermissions.every((perm) => userPermissionsSet.has(perm));

    if (!hasPermission) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    return true;
  }
}
