import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { PayBillDto } from './dto/pay-bill.dto';
import { RefundBillDto } from './dto/refund-bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { Query } from '@nestjs/common';

import { BranchId } from '../common/decorators/branch-id.decorator';
import { BranchGuard } from '../common/guards/branch.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BillingHistoryQueryDto } from './dto/history-query.dto';
import { HipaaAudit } from '../audit/hipaa-audit.decorator';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard, BranchGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  async createBill(
    @Body() createBillDto: CreateBillDto,
    @Req() req,
    @BranchId() branchId: string,
  ) {
    return this.billingService.createBill(
      createBillDto,
      req.user.id,
      branchId,
      req.ip,
    );
  }

  @Get('details/:id')
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  @HipaaAudit({ actionType: 'VIEWED_PATIENT', module: 'PATIENTS' })
  async getBillDetails(@Param('id') id: string, @BranchId() branchId: string) {
    return this.billingService.getBillById(id, branchId);
  }

  @Get(':caseId')
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  @HipaaAudit({ actionType: 'VIEWED_PATIENT', module: 'PATIENTS' })
  async getBill(@Param('caseId') caseId: string, @BranchId() branchId: string) {
    return this.billingService.getBillByCaseId(caseId, branchId);
  }

  @Get('list/pending')
  @Roles(Role.RECEPTION, Role.ADMIN)
  async getPendingBills(
    @BranchId() branchId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto || {};
    return this.billingService.getPendingBills(branchId, page, limit);
  }

  @Get('list/all')
  @Roles(Role.RECEPTION, Role.ADMIN)
  async getAllBills(
    @BranchId() branchId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto || {};
    return this.billingService.getAllBills(branchId, page, limit);
  }

  @Get('list/history')
  @Roles(Role.RECEPTION, Role.ADMIN)
  async getBillingHistory(
    @BranchId() branchId: string,
    @Query() query: BillingHistoryQueryDto,
  ) {
    return this.billingService.getBillingHistory(branchId, query);
  }

  @Post(':id/pay')
  @Roles(Role.RECEPTION, Role.ADMIN)
  @HipaaAudit({ actionType: 'UPDATED_PATIENT', module: 'PATIENTS' })
  async payBill(
    @Param('id') id: string,
    @Body() payBillDto: PayBillDto,
    @Req() req,
    @BranchId() branchId: string,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.billingService.payBill(
      id,
      payBillDto,
      req.user.id,
      branchId,
      req.ip,
      idempotencyKey,
    );
  }

  @Post(':id/finalize')
  @Roles(Role.RECEPTION, Role.ADMIN)
  @HipaaAudit({ actionType: 'UPDATED_PATIENT', module: 'PATIENTS' })
  async finalizeBill(
    @Param('id') id: string,
    @Req() req,
    @BranchId() branchId: string,
  ) {
    return this.billingService.finalizeBill(id, req.user.id, branchId, req.ip);
  }

  @Post(':id/refund')
  @Roles(Role.RECEPTION, Role.ADMIN)
  @HipaaAudit({ actionType: 'UPDATED_PATIENT', module: 'PATIENTS' })
  async refundBill(
    @Param('id') id: string,
    @Body() refundDto: RefundBillDto,
    @Req() req,
    @BranchId() branchId: string,
  ) {
    return this.billingService.processRefund(
      id,
      refundDto,
      req.user.id,
      branchId,
      req.ip,
    );
  }

  @Post(':id/pay-razorpay')
  @Roles(Role.RECEPTION, Role.ADMIN)
  @HipaaAudit({ actionType: 'UPDATED_PATIENT', module: 'PATIENTS' })
  async payRazorpay(
    @Param('id') id: string,
    @Body() payload: { paymentId: string; orderId: string; signature: string; amount: number },
    @Req() req,
    @BranchId() branchId: string,
  ) {
    return this.billingService.verifyAndPayRazorpay(
      id,
      payload,
      req.user.id,
      branchId,
      req.ip,
    );
  }
}
