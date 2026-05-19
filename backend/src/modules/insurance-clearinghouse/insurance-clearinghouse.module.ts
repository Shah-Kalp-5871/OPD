import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { ClaimRoutingService } from './services/claim-routing.service';
import { EligibilityVerificationService } from './services/eligibility-verification.service';
import { PriorAuthorizationService } from './services/prior-authorization.service';
import { InsuranceClearinghouseController } from './insurance-clearinghouse.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [ClaimRoutingService, EligibilityVerificationService, PriorAuthorizationService],
  controllers: [InsuranceClearinghouseController],
  exports: [ClaimRoutingService, EligibilityVerificationService, PriorAuthorizationService],
})
export class InsuranceClearinghouseModule {}
