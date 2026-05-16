import { Global, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { FileStorageModule } from './file-storage/file-storage.module';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [FileStorageModule, PrismaModule],
  providers: [EventsService, AuditService],
  controllers: [EventsController],
  exports: [EventsService, FileStorageModule, AuditService],
})
export class CommonModule {}
