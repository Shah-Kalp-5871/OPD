import { Module } from '@nestjs/common';
import { MlopsService } from './mlops.service';
import { MlopsController } from './mlops.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MlopsService],
  controllers: [MlopsController],
  exports: [MlopsService],
})
export class MlopsModule {}
