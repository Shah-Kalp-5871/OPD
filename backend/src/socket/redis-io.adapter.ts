import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(private readonly app: any) {
    super(app);
    const configService: ConfigService = app.get(ConfigService);
    const host = (configService.get('REDIS_HOST') as string) || 'localhost';
    const port = Number(configService.get('REDIS_PORT')) || 6379;
    const password = (configService.get('REDIS_PASSWORD') as string) || undefined;

    const isSentinel = configService.get('REDIS_SENTINEL_ENABLED') === 'true';
    const sentinelMaster = configService.get('REDIS_SENTINEL_MASTER') || 'mymaster';
    const sentinelNodesStr = configService.get('REDIS_SENTINEL_NODES') || '';

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
    redisOptions.retryStrategy = (times: number) => {
      return Math.min(times * 150, 5000);
    };
    redisOptions.reconnectOnError = (err: Error) => {
      return err.message.includes('READONLY') || err.message.includes('LOADING');
    };

    const pubClient = new Redis(redisOptions);
    const subClient = pubClient.duplicate();

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const configService: ConfigService = this.app.get(ConfigService);
    const originEnv = configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
    const origins = originEnv.split(',').map((o) => o.trim());

    const securedOptions: ServerOptions = {
      ...options,
      cors: {
        origin: origins,
        credentials: true,
        methods: ['GET', 'POST'],
      },
    } as any;

    const server = super.createIOServer(port, securedOptions);
    server.adapter(this.adapterConstructor);
    return server;
  }
}


