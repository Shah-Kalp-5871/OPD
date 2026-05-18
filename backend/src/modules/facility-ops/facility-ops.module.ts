import { Module } from '@nestjs/common';
import { FacilityOpsService } from './facility-ops.service';
import { FacilityOpsController } from './facility-ops.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  controllers: [FacilityOpsController],
  providers: [FacilityOpsService],
  exports: [FacilityOpsService],
})
export class FacilityOpsModule {}
