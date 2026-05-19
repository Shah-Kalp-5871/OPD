import { Module } from '@nestjs/common';
import { PopulationHealthService } from './population-health.service';
import { PopulationHealthController } from './population-health.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [PopulationHealthService],
  controllers: [PopulationHealthController],
  exports: [PopulationHealthService],
})
export class PopulationHealthModule {}
