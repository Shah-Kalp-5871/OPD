import { Global, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { FileStorageModule } from './file-storage/file-storage.module';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EventBusService } from './event-bus.service';
import { FileSecurityService } from './file-security.service';

@Global()
@Module({
  imports: [FileStorageModule, PrismaModule],
  providers: [EventsService, AuditService, EventBusService, FileSecurityService],
  controllers: [EventsController],
  exports: [EventsService, FileStorageModule, AuditService, EventBusService, FileSecurityService],
})
export class CommonModule {}
