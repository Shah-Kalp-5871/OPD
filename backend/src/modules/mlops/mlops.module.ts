import { Module } from '@nestjs/common';
import { MlopsService } from './mlops.service';
import { MlopsController } from './mlops.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [MlopsService],
  controllers: [MlopsController],
  exports: [MlopsService],
})
export class MlopsModule {}
