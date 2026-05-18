import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  SetMetadata,
} from '@nestjs/common';
import { ExternalLabsService } from './external-labs.service';
import { WebhookRegisterDto } from './dto/external-labs.dto';
import { ApiKeyAuthGuard } from '../common/guards/api-key-auth.guard';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

@Controller('external-labs')
export class ExternalLabsController {
  constructor(private readonly externalLabs: ExternalLabsService) {}

  /**
   * Register an outbound partner lab webhook (Restricted to Admin / Superadmin).
   */
  @Post('webhooks/register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async registerWebhook(@Body() dto: WebhookRegisterDto) {
    return this.externalLabs.registerOutboundWebhook(dto);
  }

  /**
   * List all registered outbound webhooks.
   */
  @Get('webhooks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async getWebhooks() {
    return this.externalLabs.getRegistrations();
  }

  /**
   * Inbound Webhook endpoint: external lab partners push results here.
   * Secured by ApiKeyAuthGuard, with signature verification and replay prevention.
   */
  @Post('inbound/:provider')
  @UseGuards(ApiKeyAuthGuard)
  @HttpCode(HttpStatus.OK)
  async handleInboundWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
    @Headers('x-medflow-signature') signature: string,
    @Headers('x-webhook-secret') secretHeader: string,
  ) {
    const secret = secretHeader || 'medflow_partner_secret_2026';
    if (!signature) {
      throw new BadRequestException('Signature header (x-medflow-signature) is missing');
    }
    return this.externalLabs.processInboundResult(provider, payload, signature, secret);
  }

  /**
   * Manually trigger/retry outbound lab notification (Restricted to Admin / Superadmin).
   */
  @Post('webhooks/trigger/:regId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async triggerWebhookManual(
    @Param('regId') regId: string,
    @Body() payload: any,
  ) {
    return this.externalLabs.notifyExternalPartner(regId, payload);
  }
}
