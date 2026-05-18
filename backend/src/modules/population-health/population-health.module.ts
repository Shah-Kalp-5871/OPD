import { Module } from '@nestjs/common';
import { PopulationHealthService } from './population-health.service';
import { PopulationHealthController } from './population-health.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PopulationHealthService],
  controllers: [PopulationHealthController],
  exports: [PopulationHealthService],
})
export class PopulationHealthModule {}
