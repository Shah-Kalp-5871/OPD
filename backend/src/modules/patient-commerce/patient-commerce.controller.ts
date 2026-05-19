import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { PatientBillingService } from './services/patient-billing.service';
import { ConsumerPaymentsService } from './services/consumer-payments.service';

@Controller('patient-commerce')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PatientCommerceController {
  constructor(
    private readonly billingService: PatientBillingService,
    private readonly paymentsService: ConsumerPaymentsService,
  ) {}

  @Get('invoices')
  async getInvoices(@Query('patientId') patientId: string) {
    return this.billingService.getInvoices(patientId || 'default-patient');
  }

  @Get('wallet')
  async getWallet(@Query('patientId') patientId: string) {
    return this.paymentsService.getWallet(patientId || 'default-patient');
  }

  @Post('wallet/pay')
  async makePayment(@Body() body: any) {
    return this.paymentsService.makePayment(
      body.patientId || 'default-patient',
      body.amount,
    );
  }
}