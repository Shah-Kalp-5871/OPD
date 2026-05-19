import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisClusterService {
  async getRedisHealth() {
    return [
      { node: 'redis-shard-01-master', role: 'MASTER', status: 'HEALTHY', memoryUsedBytes: 429496729, keysCount: 48922, replicationLagMs: 0 },
      { node: 'redis-shard-01-replica', role: 'REPLICA', status: 'HEALTHY', memoryUsedBytes: 429496700, keysCount: 48922, replicationLagMs: 2 },
      { node: 'redis-shard-02-master', role: 'MASTER', status: 'HEALTHY', memoryUsedBytes: 521948810, keysCount: 51290, replicationLagMs: 0 },
    ];
  }
}