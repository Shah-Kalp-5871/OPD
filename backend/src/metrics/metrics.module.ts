import { Module, Global } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { TelemetryService } from './telemetry.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [MetricsController],
  providers: [MetricsService, TelemetryService],
  exports: [MetricsService, TelemetryService],
})
export class MetricsModule {}

