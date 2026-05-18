import { Module } from '@nestjs/common';
import { RpmService } from './rpm.service';
import { RpmController } from './rpm.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RpmService],
  controllers: [RpmController],
  exports: [RpmService],
})
export class RpmModule {}
