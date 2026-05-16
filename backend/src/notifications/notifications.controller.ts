import { Controller, Get, Patch, Param, Post, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('in-app')
  async getMyNotifications(@Request() req) {
    return this.notificationsService.getInAppNotifications(req.user.id);
  }

  @Patch('in-app/:id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post('in-app/read-all')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllInAppAsRead(req.user.id);
  }
}
