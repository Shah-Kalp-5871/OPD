import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { PayBillDto } from './dto/pay-bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  async createBill(@Body() createBillDto: CreateBillDto, @Req() req) {
    return this.billingService.createBill(createBillDto, req.user.userId);
  }

  @Get(':caseId')
  async getBill(@Param('caseId') caseId: string) {
    return this.billingService.getBillByCaseId(caseId);
  }

  @Get('list/pending')
  async getPendingBills() {
    return this.billingService.getPendingBills();
  }


  @Post(':id/pay')
  @Roles(Role.RECEPTION, Role.ADMIN)
  async payBill(@Param('id') id: string, @Body() payBillDto: PayBillDto) {
    return this.billingService.payBill(id, payBillDto);
  }
}
