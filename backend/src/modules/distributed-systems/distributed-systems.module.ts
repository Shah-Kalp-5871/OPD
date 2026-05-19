import { Module } from '@nestjs/common';
import { DistributedSystemsController } from './distributed-systems.controller';
import { RedisClusterService } from './services/redis-cluster.service';
import { KafkaStreamingService } from './services/kafka-streaming.service';
import { EventReplayService } from './services/event-replay.service';
import { DistributedLockService } from './services/distributed-lock.service';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [TenancyModule],
  controllers: [DistributedSystemsController],
  providers: [
    RedisClusterService,
    KafkaStreamingService,
    EventReplayService,
    DistributedLockService,
  ],
  exports: [
    RedisClusterService,
    KafkaStreamingService,
    EventReplayService,
    DistributedLockService,
  ],
})
export class DistributedSystemsModule {}