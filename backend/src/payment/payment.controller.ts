import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/v2/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  // Depending on auth strategy, patients might just need JWT, without a specific system role.
  async createCheckoutSession(@Body() dto: CreatePaymentIntentDto, @Req() req: any) {
    const patientId = req.user.id;
    return this.paymentService.createIntent(dto, patientId);
  }
}
