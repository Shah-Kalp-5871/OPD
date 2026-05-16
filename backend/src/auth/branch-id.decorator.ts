import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BranchId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Prefer header x-branch-id for multi-branch users, fallback to user.branchId
    return request.headers['x-branch-id'] || request.user?.branchId;
  },
);
