import { Global, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { FileStorageModule } from './file-storage/file-storage.module';

@Global()
@Module({
  imports: [FileStorageModule],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService, FileStorageModule],
})
export class CommonModule {}
