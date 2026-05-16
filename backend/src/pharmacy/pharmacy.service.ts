import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../common/events.service';
import { BillingService } from '../billing/billing.service';
import { DispenseMedicationDto, ReceiveStockDto, AdjustStockDto } from './dto/pharmacy.dto';

@Injectable()
export class PharmacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly billing: BillingService,
  ) {}

  async getPharmacyQueue() {
    // Get all queue entries that are in PHARMACY_PENDING or PHARMACY_IN_PROGRESS
    return this.prisma.queueEntry.findMany({
      where: {
        status: { in: ['PHARMACY_PENDING', 'PHARMACY_IN_PROGRESS'] },
      },
      include: {
        case: {
          include: {
            patient: true,
            doctor: true,
            prescriptions: {
              where: { status: 'ACTIVE' },
              include: {
                items: {
                  include: { drug: true },
                },
              },
            },
          },
        },
      },
      orderBy: { priority: 'desc' },
    });
  }

  async dispenseMedication(dto: DispenseMedicationDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validate Prescription
      const prescription = await tx.prescription.findUnique({
        where: { id: dto.prescriptionId },
        include: { items: { include: { drug: true } } },
      });

      if (!prescription) throw new NotFoundException('Prescription not found');
      if (prescription.caseId !== dto.caseId)
        throw new BadRequestException('Prescription does not match case');

      const dispensedResults: any[] = [];

      // 2. Process each item
      for (const item of dto.items) {
        const prescriptionItem = prescription.items.find(
          (i) => i.id === item.prescriptionItemId,
        );
        if (!prescriptionItem)
          throw new BadRequestException(
            `Item ${item.prescriptionItemId} not found in prescription`,
          );

        if (prescriptionItem.isDispensed) {
          throw new BadRequestException(`Item ${prescriptionItem.drug?.drugName || 'Unknown'} has already been dispensed`);
        }

        // ROW-LEVEL LOCKING: Lock the inventory record to prevent concurrent modifications
        await tx.$executeRawUnsafe(`SELECT * FROM "DrugInventory" WHERE "drugId" = $1 FOR UPDATE`, item.drugId);

        // Check Inventory
        const inventory = await tx.drugInventory.findUnique({
          where: { drugId: item.drugId },
          include: {
            batches: {
              where: {
                isActive: true,
                isExpired: false,
                stockQuantity: { gt: 0 },
                expiryDate: { gt: new Date() },
              },
              orderBy: { expiryDate: 'asc' },
            },
          },
        });

        if (!inventory) throw new NotFoundException(`Inventory not found for drug ${item.drugId}`);

        if (inventory.totalStock < item.quantityDispensed) {
          throw new BadRequestException(
            `Insufficient total stock for drug ${item.drugId}. Required: ${item.quantityDispensed}, Available: ${inventory.totalStock}`,
          );
        }

        let remainingToDispense = item.quantityDispensed;
        const touchedBatches: any[] = [];

        // FEFO Logic: Iterate through batches sorted by expiryDate
        for (const batch of inventory.batches) {
          if (remainingToDispense <= 0) break;

          const dispenseFromBatch = Math.min(batch.stockQuantity, remainingToDispense);
          const beforeQty = batch.stockQuantity;
          const afterQty = batch.stockQuantity - dispenseFromBatch;

          // Update Batch
          await tx.drugBatch.update({
            where: { id: batch.id },
            data: {
              stockQuantity: { decrement: dispenseFromBatch },
            },
          });

          // Log Movement for Batch
          await tx.stockMovement.create({
            data: {
              inventoryId: inventory.id,
              batchId: batch.id,
              movementType: 'OUT',
              quantity: dispenseFromBatch,
              beforeQuantity: beforeQty,
              afterQuantity: afterQty,
              reason: `Dispensed for Case ${dto.caseId} (Prescription: ${dto.prescriptionId})`,
              performedById: userId,
              referenceId: dto.caseId,
            },
          });

          remainingToDispense -= dispenseFromBatch;
          touchedBatches.push({
            batchId: batch.id,
            batchNumber: batch.batchNumber,
            quantity: dispenseFromBatch,
            mrp: batch.mrp,
          });
        }

        if (remainingToDispense > 0) {
          throw new BadRequestException(
            `Could not satisfy dispensing requirements for drug ${item.drugId} from active batches. Check batch expiry or status.`,
          );
        }

        // Update Total Inventory Stock
        await tx.drugInventory.update({
          where: { id: inventory.id },
          data: {
            totalStock: { decrement: item.quantityDispensed },
          },
        });

        // Update Prescription Item
        await tx.prescriptionItem.update({
          where: { id: item.prescriptionItemId },
          data: { isDispensed: true },
        });

        dispensedResults.push({
          drugId: item.drugId,
          drugName: prescriptionItem.drug?.drugName || 'Unknown',
          quantity: item.quantityDispensed,
          batches: touchedBatches,
          totalPrice: touchedBatches.reduce((acc, b) => acc + (Number(b.quantity) * Number(b.mrp)), 0)
        });
      }

      // 3. Billing Integration
      const patientCase = await tx.patientCase.findUnique({
        where: { id: dto.caseId },
        select: { patientId: true }
      });

      if (patientCase) {
        const bill = await this.billing.ensureActiveBill(
          dto.caseId,
          patientCase.patientId,
          userId
        );

        if (!bill.isFinalized) {
          await this.billing.addItemsToBill(
            bill.id,
            dispensedResults.map(res => ({
              serviceName: res.drugName,
              quantity: res.quantity,
              unitPrice: res.totalPrice / res.quantity,
              discount: 0,
              itemType: 'PHARMACY',
              referenceId: res.drugId
            }))
          );
        }
      }

      // 4. Update Queue Entry status
      await tx.queueEntry.update({
        where: { caseId: dto.caseId },
        data: { status: 'COMPLETED' }, 
      });

      // 5. Create Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          entityType: 'PHARMACY',
          entityId: dto.prescriptionId,
          action: 'DISPENSE',
          details: `Dispensed ${dto.items.length} items for Case ${dto.caseId} using FEFO.`,
        },
      });

      return { success: true, items: dispensedResults };
    });
  }

  async receiveStock(dto: any, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const { drugId, batchNumber, expiryDate, manufacturingDate, mrp, purchasePrice, quantity, supplierId, location } = dto;

      let inventory = await tx.drugInventory.findUnique({
        where: { drugId },
      });

      if (!inventory) {
        inventory = await tx.drugInventory.create({
          data: { drugId, location },
        });
      }

      const beforeTotal = inventory.totalStock;

      // Check if batch exists
      let batch = await tx.drugBatch.findUnique({
        where: { batchNumber },
      });

      let beforeBatchQty = 0;
      if (batch) {
        if (batch.inventoryId !== inventory.id) {
          throw new BadRequestException('Batch number belongs to a different drug inventory');
        }
        beforeBatchQty = batch.stockQuantity;
        batch = await tx.drugBatch.update({
          where: { id: batch.id },
          data: {
            stockQuantity: { increment: quantity },
            expiryDate: new Date(expiryDate),
            manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : null,
            mrp,
            purchasePrice,
            supplierId,
          },
        });
      } else {
        batch = await tx.drugBatch.create({
          data: {
            inventoryId: inventory.id,
            batchNumber,
            expiryDate: new Date(expiryDate),
            manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : null,
            mrp,
            purchasePrice,
            stockQuantity: quantity,
            supplierId,
          },
        });
      }

      // Update Total Stock
      await tx.drugInventory.update({
        where: { id: inventory.id },
        data: {
          totalStock: { increment: quantity },
          status: 'IN_STOCK',
        },
      });

      // Log Movement
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          batchId: batch.id,
          movementType: 'IN',
          quantity,
          beforeQuantity: beforeBatchQty,
          afterQuantity: beforeBatchQty + quantity,
          unitPrice: purchasePrice,
          reason: 'Stock Inward / Purchase',
          performedById: userId,
        },
      });

      return { success: true, batchId: batch.id, newTotal: beforeTotal + quantity };
    });
  }

  async adjustStock(dto: any, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const { batchId, quantity, type, reason } = dto;

      const batch = await tx.drugBatch.findUnique({
        where: { id: batchId },
        include: { inventory: true },
      });

      if (!batch) throw new NotFoundException('Batch not found');

      const beforeQty = batch.stockQuantity;
      let afterQty = beforeQty;

      if (type === 'INCREMENT') {
        afterQty += quantity;
      } else {
        if (beforeQty < quantity) throw new BadRequestException('Insufficient stock in batch for adjustment');
        afterQty -= quantity;
      }

      // Update Batch
      await tx.drugBatch.update({
        where: { id: batchId },
        data: { stockQuantity: afterQty },
      });

      // Update Inventory
      await tx.drugInventory.update({
        where: { id: batch.inventoryId },
        data: {
          totalStock: type === 'INCREMENT' ? { increment: quantity } : { decrement: quantity },
        },
      });

      // Log Movement
      await tx.stockMovement.create({
        data: {
          inventoryId: batch.inventoryId,
          batchId: batch.id,
          movementType: 'ADJUSTMENT',
          quantity: type === 'INCREMENT' ? quantity : -quantity,
          beforeQuantity: beforeQty,
          afterQuantity: afterQty,
          reason: reason || 'Manual adjustment',
          performedById: userId,
        },
      });

      return { success: true, beforeQty, afterQty };
    });
  }

  async getInventory() {
    return this.prisma.drugInventory.findMany({
      include: {
        drug: true,
        batches: {
          orderBy: { expiryDate: 'asc' },
        },
      },
    });
  }

  async getInventoryAlerts() {
    const nearExpiryDate = new Date();
    nearExpiryDate.setDate(nearExpiryDate.getDate() + 90); // 90 days threshold

    const [nearExpiry, expired] = await Promise.all([
      // 2. Near Expiry
      this.prisma.drugBatch.findMany({
        where: {
          stockQuantity: { gt: 0 },
          expiryDate: { lte: nearExpiryDate, gt: new Date() },
          isActive: true,
        },
        include: { inventory: { include: { drug: true } } },
      }),
      // 3. Expired
      this.prisma.drugBatch.findMany({
        where: {
          stockQuantity: { gt: 0 },
          expiryDate: { lte: new Date() },
        },
        include: { inventory: { include: { drug: true } } },
      }),
    ]);

    // Low stock needs raw query for field comparison
    const lowStock: any[] = await this.prisma.$queryRaw`
      SELECT di.*, d.name as "drugName"
      FROM "DrugInventory" di
      JOIN "Drug" d ON d.id = di."drugId"
      WHERE di."totalStock" <= di."reorderLevel" OR di."totalStock" = 0
    `;

    return { lowStock, nearExpiry, expired };
  }

  async getStockValuation() {
    const batches = await this.prisma.drugBatch.findMany({
      where: { stockQuantity: { gt: 0 } },
    });

    let totalValue = 0;
    batches.forEach((batch) => {
      totalValue += Number(batch.purchasePrice) * batch.stockQuantity;
    });

    return { totalValue, batchCount: batches.length };
  }

  async getMovementHistory(filters: { drugId?: string; batchId?: string }) {
    return this.prisma.stockMovement.findMany({
      where: {
        inventory: filters.drugId ? { drugId: filters.drugId } : undefined,
        batchId: filters.batchId,
      },
      include: {
        inventory: { include: { drug: true } },
        batch: true,
        performedBy: { select: { name: true, id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getCasePrescriptions(caseId: string) {
    const patientCase = await this.prisma.patientCase.findUnique({
      where: { id: caseId },
      include: {
        patient: true,
        doctor: true,
        prescriptions: {
          where: { status: 'ACTIVE' },
          include: {
            items: {
              include: {
                drug: {
                  include: { inventory: true },
                },
              },
            },
          },
        },
      },
    });

    if (!patientCase) throw new NotFoundException('Case not found');
    return patientCase;
  }
}
