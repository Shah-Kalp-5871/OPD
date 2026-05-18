import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(app: any) {
    super(app);
    const configService: ConfigService = app.get(ConfigService);
    const host = (configService.get('REDIS_HOST') as string) || 'localhost';
    const port = Number(configService.get('REDIS_PORT')) || 6379;
    const password = (configService.get('REDIS_PASSWORD') as string) || undefined;

    const redisOptions = { host, port, ...(password ? { password } : {}) };
    const pubClient = new Redis(redisOptions);
    const subClient = pubClient.duplicate();

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
