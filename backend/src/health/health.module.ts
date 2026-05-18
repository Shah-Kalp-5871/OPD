import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaModule } from '../prisma/prisma.module';

// NOTE: @nestjs/axios NOT imported — we are not using HttpHealthIndicator
// Redis health is checked directly via ioredis in the controller
// BullMQ queues are available globally via JobsModule (@Global)

@Module({
  imports: [
    TerminusModule,
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
