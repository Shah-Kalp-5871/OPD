import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { AppGateway } from './app.gateway';
import * as net from 'net';

async function checkRedisAlive(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(400);
    socket.on('connect', () => {
      socket.end();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisPubSubService.name);
  private pubClient: Redis | null = null;
  private subClient: Redis | null = null;
  private isFallbackMode = false;
  private readonly channel = 'opd:queue:sync';

  constructor(
    private readonly configService: ConfigService,
    private readonly appGateway: AppGateway,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing Redis Pub/Sub connections...');
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = Number(this.configService.get('REDIS_PORT')) || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD') || undefined;

    const isSentinel = this.configService.get<string>('REDIS_SENTINEL_ENABLED') === 'true';
    const sentinelMaster = this.configService.get<string>('REDIS_SENTINEL_MASTER') || 'mymaster';
    const sentinelNodesStr = this.configService.get<string>('REDIS_SENTINEL_NODES') || '';

    let redisAvailable = false;
    if (isSentinel && sentinelNodesStr) {
      const nodes = sentinelNodesStr.split(',');
      for (const node of nodes) {
        const [shost, sport] = node.trim().split(':');
        const alive = await checkRedisAlive(shost, parseInt(sport, 10));
        if (alive) {
          redisAvailable = true;
          break;
        }
      }
    } else {
      redisAvailable = await checkRedisAlive(host, port);
    }

    if (!redisAvailable) {
      this.logger.warn(`Redis is not reachable at ${host}:${port}. Falling back gracefully to LOCAL Pub/Sub mode.`);
      this.isFallbackMode = true;
      return;
    }

    const redisOptions: any = isSentinel && sentinelNodesStr
      ? {
          sentinels: sentinelNodesStr.split(',').map((node) => {
            const [shost, sport] = node.trim().split(':');
            return { host: shost, port: parseInt(sport, 10) };
          }),
          name: sentinelMaster,
          password: password || undefined,
          sentinelPassword: password || undefined,
        }
      : { host, port, ...(password ? { password } : {}) };

    // Enterprise-grade reconnect strategies
    redisOptions.retryStrategy = (times: number) => Math.min(times * 150, 5000);
    redisOptions.reconnectOnError = (err: Error) =>
      err.message.includes('READONLY') || err.message.includes('LOADING');
    redisOptions.maxRetriesPerRequest = null;

    try {
      this.pubClient = new Redis(redisOptions);
      this.subClient = this.pubClient.duplicate();

      this.pubClient.on('error', (err) => {
        this.logger.warn(`RedisPubSubService pubClient error: ${err.message}`);
      });
      this.subClient.on('error', (err) => {
        this.logger.warn(`RedisPubSubService subClient error: ${err.message}`);
      });

      // Listen for messages
      this.subClient.on('message', (channel, message) => {
        if (channel === this.channel) {
          this.handleIncomingMessage(message);
        }
      });

      this.subClient.subscribe(this.channel)
        .then(() => {
          this.logger.log(`Successfully subscribed to Redis channel: ${this.channel}`);
        })
        .catch((error) => {
          this.logger.error(`Failed to subscribe to Redis channel: ${error.message}`);
        });
    } catch (error) {
      this.logger.error(`Failed to initialize Redis Pub/Sub: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing Redis Pub/Sub connections...');
    if (this.subClient) {
      await this.subClient.unsubscribe(this.channel);
      this.subClient.disconnect();
    }
    if (this.pubClient) {
      this.pubClient.disconnect();
    }
  }

  /**
   * Publish an event to the Redis Pub/Sub channel
   */
  async publish(event: string, payload: any) {
    if (this.isFallbackMode) {
      try {
        const message = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
        this.handleIncomingMessage(message);
      } catch (error: any) {
        this.logger.error(`Local fallback publish failed: ${error.message}`);
      }
      return;
    }

    if (!this.pubClient) {
      this.logger.error('Redis publisher client is not initialized');
      return;
    }

    try {
      const message = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
      await this.pubClient.publish(this.channel, message);
      this.logger.debug(`Published event [${event}] to Redis channel [${this.channel}]`);
    } catch (error: any) {
      this.logger.error(`Failed to publish event to Redis: ${error.message}`);
    }
  }

  /**
   * Handle messages received from Redis Pub/Sub channel
   */
  private handleIncomingMessage(messageStr: string) {
    try {
      const { event, payload } = JSON.parse(messageStr);
      this.logger.log(`Received Redis event [${event}] on pod`);

      switch (event) {
        case 'STATUS_CHANGED':
        case 'SESSION_STARTED':
        case 'SESSION_ENDED':
          // Emitting to waiting rooms and specific doctor dashboard
          this.appGateway.broadcastGlobal(event, payload);
          if (payload.branchId) {
            this.appGateway.broadcastToRoom(`branch:${payload.branchId}`, event, payload);
          }
          break;

        case 'QUEUE_ORDER_SYNC':
          if (payload.branchId) {
            this.appGateway.broadcastToRoom(`branch:${payload.branchId}`, 'queue-sync', payload);
          }
          break;

        default:
          this.logger.warn(`Unhandled sync event: ${event}`);
      }
    } catch (error) {
      this.logger.error(`Failed to parse incoming Redis Pub/Sub message: ${error.message}`);
    }
  }
}
