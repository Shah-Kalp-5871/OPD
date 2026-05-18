import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { HipaaAuditInterceptor } from './hipaa-audit.interceptor';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AuditService, HipaaAuditInterceptor],
  controllers: [AuditController],
  exports: [AuditService, HipaaAuditInterceptor],
})
export class AuditModule {}
