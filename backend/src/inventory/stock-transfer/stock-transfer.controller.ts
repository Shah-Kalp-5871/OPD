import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { CreateStockTransferDto } from './dto/stock-transfer.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { BranchGuard } from '../../auth/branch.guard';

@Controller('inventory/stock-transfers')
@UseGuards(JwtAuthGuard, RolesGuard, BranchGuard)
export class StockTransferController {
  constructor(private readonly stockTransferService: StockTransferService) {}

  @Post()
  @Roles('SUPERADMIN', 'BRANCH_ADMIN', 'CENTRAL_PHARMACY', 'PHARMACY')
  create(@Body() createDto: CreateStockTransferDto, @Req() req: any) {
    const branchId = req.headers['x-branch-id'];
    const userId = req.user.id;
    return this.stockTransferService.createTransfer(createDto, branchId, userId);
  }

  @Get()
  @Roles('SUPERADMIN', 'BRANCH_ADMIN', 'CENTRAL_PHARMACY', 'PHARMACY')
  findAll(@Req() req: any) {
    const branchId = req.headers['x-branch-id'];
    const role = req.user.role;
    return this.stockTransferService.getTransfers(branchId, role);
  }

  @Get(':id')
  @Roles('SUPERADMIN', 'BRANCH_ADMIN', 'CENTRAL_PHARMACY', 'PHARMACY')
  findOne(@Param('id') id: string) {
    return this.stockTransferService.getTransferById(id);
  }

  @Patch(':id/approve')
  @Roles('SUPERADMIN', 'BRANCH_ADMIN', 'CENTRAL_PHARMACY')
  approve(@Param('id') id: string, @Req() req: any) {
    const branchId = req.headers['x-branch-id'];
    const userId = req.user.id;
    return this.stockTransferService.approveTransfer(id, userId, branchId);
  }

  @Patch(':id/dispatch')
  @Roles('SUPERADMIN', 'BRANCH_ADMIN', 'CENTRAL_PHARMACY', 'PHARMACY')
  dispatchTransfer(@Param('id') id: string, @Req() req: any) {
    const branchId = req.headers['x-branch-id'];
    const userId = req.user.id;
    return this.stockTransferService.dispatchTransfer(id, userId, branchId);
  }

  @Patch(':id/receive')
  @Roles('SUPERADMIN', 'BRANCH_ADMIN', 'CENTRAL_PHARMACY', 'PHARMACY')
  receiveTransfer(@Param('id') id: string, @Req() req: any) {
    const branchId = req.headers['x-branch-id'];
    const userId = req.user.id;
    return this.stockTransferService.receiveTransfer(id, userId, branchId);
  }
}
