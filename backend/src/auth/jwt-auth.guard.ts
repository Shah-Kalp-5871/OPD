import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { tenancyStore } from '../modules/tenancy/tenancy.context';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const resolvedUser = super.handleRequest(err, user, info, context);
    if (resolvedUser) {
      const store = tenancyStore.getStore();
      if (store) {
        store.userId = resolvedUser.id;
        store.role = resolvedUser.role;
      }
    }
    return resolvedUser;
  }
}
