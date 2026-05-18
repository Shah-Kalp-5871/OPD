import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommunicationHubService } from './communication-hub.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/v2/communication-hub')
@UseGuards(JwtAuthGuard)
export class CommunicationHubController {
  constructor(private readonly service: CommunicationHubService) {}

  @Post(':tenantId/messages')
  sendMessage(
    @Param('tenantId') tenantId: string,
    @Body() body: { senderId: string; content: string; recipientId?: string; roomId?: string; type?: string },
  ) {
    return this.service.sendMessage(tenantId, body.senderId, body.content, body.recipientId, body.roomId, body.type);
  }

  @Get(':tenantId/messages')
  getMessages(
    @Param('tenantId') tenantId: string,
    @Query('recipientId') recipientId?: string,
    @Query('roomId') roomId?: string,
    @Query('senderId') senderId?: string,
  ) {
    return this.service.getMessages(tenantId, { recipientId, roomId, senderId });
  }

  @Patch(':tenantId/messages/:messageId/read')
  markRead(@Param('tenantId') tenantId: string, @Param('messageId') messageId: string) {
    return this.service.markRead(tenantId, messageId);
  }
}
