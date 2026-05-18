import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { HealthExchangeService } from './health-exchange.service';
import { RegisterConnectorDto, CreateExchangeLogDto } from './dto/health-exchange.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Permissions } from '../../auth/permissions.decorator';

@Controller('api/v2/health-exchange')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthExchangeController {
  constructor(private readonly healthExchangeService: HealthExchangeService) {}

  @Post(':tenantId/connectors')
  @Permissions('SYSTEM_ADMIN')
  registerConnector(@Param('tenantId') tenantId: string, @Body() dto: RegisterConnectorDto) {
    return this.healthExchangeService.registerConnector(tenantId, dto);
  }

  @Get(':tenantId/connectors')
  getConnectors(@Param('tenantId') tenantId: string) {
    return this.healthExchangeService.getConnectors(tenantId);
  }

  @Post(':tenantId/logs')
  logExchange(@Param('tenantId') tenantId: string, @Body() dto: CreateExchangeLogDto) {
    return this.healthExchangeService.logExchange(tenantId, dto);
  }
}
