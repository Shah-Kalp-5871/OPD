import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BranchGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const branchId = request.headers['x-branch-id'];

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Admins might have access to all branches, or a specific set
    // For now, if x-branch-id is provided, check if user is admin or it matches their branchId
    if (branchId) {
      if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
        return true;
      }
      if (user.branchId && user.branchId !== branchId) {
        throw new ForbiddenException('Access to this branch is restricted');
      }
      return true;
    }

    // If no x-branch-id header, fall back to user's primary branchId
    if (!user.branchId && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw new UnauthorizedException('User is not assigned to any branch');
    }

    return true;
  }
}
