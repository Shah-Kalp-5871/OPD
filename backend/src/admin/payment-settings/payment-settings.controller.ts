import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';
import { PaymentSettingsService } from './payment-settings.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

class UpdatePaymentSettingsDto {
  @IsString()
  upiId: string;

  @IsOptional()
  @IsString()
  upiPayeeName?: string;
}

@Controller('admin/payment-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentSettingsController {
  constructor(private readonly paymentSettingsService: PaymentSettingsService) {}

  @Get()
  @Roles('ADMIN', 'SUPERADMIN', 'RECEPTION', 'DOCTOR')
  getSettings() {
    return this.paymentSettingsService.getSettings();
  }

  @Put()
  @Roles('ADMIN', 'SUPERADMIN')
  updateSettings(@Body() dto: UpdatePaymentSettingsDto) {
    return this.paymentSettingsService.updateSettings(dto);
  }
}
