import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PLANS_KEY = 'requiredPlans';
export const RequireSubscriptionPlan = (...plans: string[]) => SetMetadata(REQUIRE_PLANS_KEY, plans);
