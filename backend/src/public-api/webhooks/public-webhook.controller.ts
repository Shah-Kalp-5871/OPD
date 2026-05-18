import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Scopes } from '../auth/scopes.decorator';
import { PublicWebhookService } from './public-webhook.service';

@Controller('api/v2/webhooks')
@UseGuards(ApiKeyGuard)
export class PublicWebhookController {
  constructor(private readonly webhookService: PublicWebhookService) {}

  /**
   * Registers a new webhook subscription.
   */
  @Post('subscriptions')
  @Scopes('webhooks:write')
  async createSubscription(
    @Req() req: any,
    @Body() body: { url: string; events: string[] }
  ) {
    return this.webhookService.createSubscription({
      clientId: req.clientId,
      url: body.url,
      events: body.events,
    });
  }

  /**
   * Lists all webhook subscriptions for the authenticated client.
   */
  @Get('subscriptions')
  @Scopes('webhooks:read')
  async listSubscriptions(@Req() req: any) {
    return this.webhookService.listSubscriptions(req.clientId);
  }

  /**
   * Deletes a webhook subscription by ID.
   */
  @Delete('subscriptions/:id')
  @Scopes('webhooks:write')
  async deleteSubscription(
    @Req() req: any,
    @Param('id') id: string
  ) {
    return this.webhookService.deleteSubscription(id, req.clientId);
  }
}
