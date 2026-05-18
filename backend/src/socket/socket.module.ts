import { Module, Global } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { RedisPubSubService } from './redis-pubsub.service';

@Global()
@Module({
  providers: [AppGateway, RedisPubSubService],
  exports: [AppGateway, RedisPubSubService],
})
export class SocketModule {}
