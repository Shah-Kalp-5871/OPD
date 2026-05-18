import { Module } from '@nestjs/common';
import { HealthExchangeService } from './health-exchange.service';
import { HealthExchangeController } from './health-exchange.controller';

@Module({
  providers: [HealthExchangeService],
  controllers: [HealthExchangeController]
})
export class HealthExchangeModule {}
