import { Module } from '@nestjs/common';
import { ExternalLabsService } from './external-labs.service';
import { ExternalLabsController } from './external-labs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExternalLabsService],
  controllers: [ExternalLabsController],
  exports: [ExternalLabsService],
})
export class ExternalLabsModule {}
