import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payroll: PayrollService) {}

  @Get('dashboard')
  getDashboard() { return this.payroll.getDashboardData(); }

  @Post('cycles/:month/initiate')
  initiate(@Param('month') month: string) { return this.payroll.initiateCycle(month); }

  @Post('cycles/:month/process')
  process(@Param('month') month: string) { return this.payroll.processPayroll(month); }

  @Post('reimbursements')
  submitReimbursement(@Body() body: Parameters<PayrollService['submitReimbursement']>[0]) {
    return this.payroll.submitReimbursement(body);
  }
}
