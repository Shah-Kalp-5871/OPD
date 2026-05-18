import {
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterDeviceTokenDto } from './dto/device-token.dto';
import { UpdatePreferenceDto } from './dto/preference.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ==========================================
  // BACKWARD COMPATIBLE V1 IN-APP ENDPOINTS
  // ==========================================

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

  // ==========================================
  // ENTERPRISE V2 NOTIFICATION MANAGEMENT
  // ==========================================

  @Post('device-token')
  async registerDeviceToken(
    @Request() req,
    @Body() dto: RegisterDeviceTokenDto,
  ) {
    return this.notificationsService.registerDeviceToken(req.user.id, dto);
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    return this.notificationsService.getPreferences(req.user.id);
  }

  @Patch('preferences')
  async updatePreferences(
    @Request() req,
    @Body() dto: UpdatePreferenceDto,
  ) {
    return this.notificationsService.updatePreferences(req.user.id, dto);
  }
}
