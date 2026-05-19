import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { RedisClusterService } from './services/redis-cluster.service';
import { KafkaStreamingService } from './services/kafka-streaming.service';
import { EventReplayService } from './services/event-replay.service';
import { DistributedLockService } from './services/distributed-lock.service';

@Controller('distributed-systems')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DistributedSystemsController {
  constructor(
    private readonly redis: RedisClusterService,
    private readonly kafka: KafkaStreamingService,
    private readonly replay: EventReplayService,
    private readonly lock: DistributedLockService,
  ) {}

  @Get('redis')
  async getRedis() {
    return this.redis.getRedisHealth();
  }

  @Get('kafka')
  async getKafka() {
    return this.kafka.getKafkaStatus();
  }

  @Post('kafka/replay')
  async triggerReplay(@Body() body: { topic: string; hours: number }) {
    return this.replay.triggerEventReplay(body.topic, body.hours);
  }

  @Get('locks')
  async getLocks() {
    return this.lock.getActiveLocks();
  }
}