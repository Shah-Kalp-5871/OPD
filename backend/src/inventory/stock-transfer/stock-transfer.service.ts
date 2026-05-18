import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateStockTransferDto,
  UpdateStockTransferStatusDto,
} from './dto/stock-transfer.dto';

@Injectable()
export class StockTransferService {
  constructor(private prisma: PrismaService) {}

  async createTransfer(
    createDto: CreateStockTransferDto,
    sourceBranchId: string,
    userId: string,
  ) {
    if (sourceBranchId === createDto.destBranchId) {
      throw new BadRequestException('Cannot transfer stock to the same branch');
    }

    return this.prisma.$transaction(async (tx) => {
      // Create the transfer record
      const transfer = await tx.stockTransfer.create({
        data: {
          sourceBranchId,
          destBranchId: createDto.destBranchId,
          status: 'REQUESTED',
          requestedById: userId,
          notes: createDto.notes,
          items: {
            create: createDto.items.map((item) => ({
              drugId: item.drugId,
              batchId: item.batchId,
              requestedQty: item.requestedQty,
            })),
          },
        },
        include: { items: true },
      });

      return transfer;
    });
  }

  async getTransfers(branchId: string, role: string) {
    const whereClause =
      role === 'SUPERADMIN'
        ? {}
        : {
            OR: [{ sourceBranchId: branchId }, { destBranchId: branchId }],
          };

    return this.prisma.stockTransfer.findMany({
      where: whereClause,
      include: {
        sourceBranch: { select: { name: true, branchCode: true } },
        destBranch: { select: { name: true, branchCode: true } },
        requestedBy: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTransferById(id: string) {
    const transfer = await this.prisma.stockTransfer.findUnique({
      where: { id },
      include: {
        sourceBranch: true,
        destBranch: true,
        requestedBy: { select: { name: true } },
        approvedBy: { select: { name: true } },
        items: {
          include: {
            drug: true,
            batch: true,
          },
        },
      },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    return transfer;
  }

  async approveTransfer(id: string, userId: string, branchId: string) {
    return this.prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findFirst({
        where: { id, sourceBranchId: branchId },
        include: { items: true },
      });

      if (!transfer) throw new NotFoundException('Transfer not found');
      if (transfer.status !== 'REQUESTED') {
        throw new BadRequestException(
          `Cannot approve transfer in status ${transfer.status}`,
        );
      }

      // We only update status here. Dispatch actually moves the stock.
      return tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedById: userId,
        },
      });
    });
  }

  async dispatchTransfer(id: string, userId: string, branchId: string) {
    return this.prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findFirst({
        where: { id, sourceBranchId: branchId },
        include: { items: { include: { drug: true } } },
      });

      if (!transfer) throw new NotFoundException('Transfer not found');
      if (transfer.status !== 'APPROVED') {
        throw new BadRequestException(
          `Cannot dispatch transfer in status ${transfer.status}`,
        );
      }

      // Actually deduct stock from source branch
      for (const item of transfer.items) {
        // Find inventory record
        const inventory = await tx.drugInventory.findFirst({
          where: { drugId: item.drugId, branchId },
        });

        if (!inventory || inventory.totalStock < item.requestedQty) {
          throw new BadRequestException(
            `Insufficient stock for drug ${item.drug.drugName}`,
          );
        }

        // Deduct from total stock
        await tx.drugInventory.update({
          where: { id: inventory.id },
          data: { totalStock: { decrement: item.requestedQty } },
        });

        // Record movement
        await tx.stockMovement.create({
          data: {
            inventoryId: inventory.id,
            drugId: item.drugId,
            movementType: 'OUT',
            quantity: item.requestedQty,
            reason: 'TRANSFER',
            referenceId: transfer.id,
            performedById: userId,
            branchId,
          },
        });

        // Update item dispatched qty
        await tx.stockTransferItem.update({
          where: { id: item.id },
          data: {
            dispatchedQty: item.requestedQty,
            status: 'DISPATCHED',
          },
        });
      }

      return tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'IN_TRANSIT',
          dispatchedById: userId,
        },
      });
    });
  }

  async receiveTransfer(id: string, userId: string, branchId: string) {
    return this.prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findFirst({
        where: { id, destBranchId: branchId },
        include: { items: true },
      });

      if (!transfer) throw new NotFoundException('Transfer not found');
      if (transfer.status !== 'IN_TRANSIT') {
        throw new BadRequestException(
          `Cannot receive transfer in status ${transfer.status}`,
        );
      }

      // Add stock to destination branch
      for (const item of transfer.items) {
        // Find or create inventory record
        let inventory = await tx.drugInventory.findFirst({
          where: { drugId: item.drugId, branchId },
        });

        if (!inventory) {
          // Find drug details to create inventory
          const drug = await tx.drug.findUnique({ where: { id: item.drugId } });
          if (!drug) throw new NotFoundException('Drug not found');

          inventory = await tx.drugInventory.create({
            data: {
              drugId: item.drugId,
              branchId,
              totalStock: 0,
              reorderLevel: 10,
              location: 'Main Pharmacy',
            },
          });
        }

        // Add to total stock
        await tx.drugInventory.update({
          where: { id: inventory.id },
          data: { totalStock: { increment: item.dispatchedQty } },
        });

        // Record movement
        await tx.stockMovement.create({
          data: {
            inventoryId: inventory.id,
            drugId: item.drugId,
            movementType: 'IN',
            quantity: item.dispatchedQty,
            reason: 'TRANSFER',
            referenceId: transfer.id,
            performedById: userId,
            branchId,
          },
        });

        // Update item received qty
        await tx.stockTransferItem.update({
          where: { id: item.id },
          data: {
            receivedQty: item.dispatchedQty,
            status: 'RECEIVED',
          },
        });
      }

      return tx.stockTransfer.update({
        where: { id },
        data: {
          status: 'RECEIVED',
          receivedById: userId,
        },
      });
    });
  }
}
