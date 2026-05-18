import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CdsService } from './cds.service';
import { CreateCdsRuleDto, EvaluateCdsDto } from './dto/cds-rule.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Permissions } from '../../auth/permissions.decorator';

@Controller('api/v2/cds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CdsController {
  constructor(private readonly cdsService: CdsService) {}

  @Post(':tenantId/rules')
  @Permissions('SYSTEM_ADMIN')
  createRule(@Param('tenantId') tenantId: string, @Body() dto: CreateCdsRuleDto) {
    return this.cdsService.createRule(tenantId, dto);
  }

  @Get(':tenantId/rules')
  getRules(@Param('tenantId') tenantId: string) {
    return this.cdsService.getRules(tenantId);
  }

  @Post(':tenantId/evaluate')
  evaluate(@Param('tenantId') tenantId: string, @Body() dto: EvaluateCdsDto) {
    return this.cdsService.evaluate(tenantId, dto);
  }
}
