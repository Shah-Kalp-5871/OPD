import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('health')
export class HealthController {
  private readonly redisClient: Redis;

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private configService: ConfigService,
    @InjectQueue('reports') private readonly reportsQueue: Queue,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {
    // Initialize Redis client for health checks
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = this.configService.get<number>('REDIS_PORT') || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD') || undefined;

    const isSentinel = this.configService.get<string>('REDIS_SENTINEL_ENABLED') === 'true';
    const sentinelMaster = this.configService.get<string>('REDIS_SENTINEL_MASTER') || 'mymaster';
    const sentinelNodesStr = this.configService.get<string>('REDIS_SENTINEL_NODES') || '';

    const redisOptions: any = isSentinel && sentinelNodesStr
      ? {
          sentinels: sentinelNodesStr.split(',').map((node) => {
            const [shost, sport] = node.trim().split(':');
            return { host: shost, port: parseInt(sport, 10) };
          }),
          name: sentinelMaster,
          password: password || undefined,
          sentinelPassword: password || undefined,
          lazyConnect: true,
          connectTimeout: 5000,
        }
      : {
          host,
          port,
          password,
          lazyConnect: true,
          connectTimeout: 5000,
        };

    this.redisClient = new Redis(redisOptions);
  }

  /**
   * Full system health check — database, redis, memory, disk, queues
   * GET /api/health
   */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // ── Database ──
      () => this.prismaHealth.pingCheck('database', this.prisma),

      // ── Redis ──
      async () => {
        const key = 'health:ping';
        try {
          await this.redisClient.set(key, 'ok', 'EX', 10);
          const val = await this.redisClient.get(key);
          if (val !== 'ok') throw new Error('Redis ping value mismatch');
          return { redis: { status: 'up' } };
        } catch (err) {
          return { redis: { status: 'down', error: (err as Error).message } };
        }
      },

      // ── BullMQ Queues ──
      async () => {
        try {
          const [reportsCounts, notifCounts] = await Promise.all([
            this.reportsQueue.getJobCounts(),
            this.notificationsQueue.getJobCounts(),
          ]);
          return {
            bullmq: {
              status: 'up',
              queues: {
                reports: reportsCounts,
                notifications: notifCounts,
              },
            },
          };
        } catch (err) {
          return {
            bullmq: {
              status: 'down',
              error: (err as Error).message,
            },
          };
        }
      },

      // ── Memory ──
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

      // ── Disk ──
      () =>
        this.disk.checkStorage('storage', {
          path: process.platform === 'win32' ? 'C:\\' : '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  /**
   * Lightweight liveness probe — just returns OK
   * GET /api/health/live
   */
  @Get('live')
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /**
   * Readiness probe — checks if app is ready to accept traffic
   * GET /api/health/ready
   */
  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
