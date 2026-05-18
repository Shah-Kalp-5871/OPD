import { Module } from '@nestjs/common';
import { GracefulShutdownService } from './graceful-shutdown.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GracefulShutdownService],
  exports: [GracefulShutdownService],
})
export class ShutdownModule {}
