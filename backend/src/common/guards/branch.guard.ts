import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

@Injectable()
export class BranchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const branchId = request.headers['x-branch-id'];

    if (!branchId) {
      throw new BadRequestException('x-branch-id header is required');
    }

    const user = request.user;
    if (!user) {
      return false; // Authentication should happen before BranchGuard
    }

    // SUPERADMIN can access any branch
    if (user.role === 'SUPERADMIN') {
      return true;
    }

    // Check if user has access to this branch
    const hasAccess = 
      user.primaryBranchId === branchId || 
      user.branchAccess?.includes(branchId);

    if (!hasAccess) {
      return false; // User does not have access to this branch
    }

    return true;
  }
}
