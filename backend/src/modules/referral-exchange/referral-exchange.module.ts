import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { CareCoordinationService } from './services/care-coordination.service';
import { ProviderNetworkService } from './services/provider-network.service';
import { ReferralExchangeController } from './referral-exchange.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [CareCoordinationService, ProviderNetworkService],
  controllers: [ReferralExchangeController],
  exports: [CareCoordinationService, ProviderNetworkService],
})
export class ReferralExchangeModule {}
