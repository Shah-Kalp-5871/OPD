import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../common/events.service';
import { BillingService } from '../billing/billing.service';
import {
  DispenseMedicationDto,
  ReceiveStockDto,
  AdjustStockDto,
} from './dto/pharmacy.dto';
import { Decimal } from 'decimal.js';

@Injectable()
export class PharmacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly billing: BillingService,
  ) {}

  async getPharmacyQueue(branchId: string) {
    // Get all queue entries that are in PHARMACY_PENDING or PHARMACY_IN_PROGRESS
    return this.prisma.queueEntry.findMany({
      where: {
        branchId,
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

  async dispenseMedication(
    dto: DispenseMedicationDto,
    userId: string,
    branchId: string,
  ) {
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
          throw new BadRequestException(
            `Item ${prescriptionItem.drug?.drugName || 'Unknown'} has already been dispensed`,
          );
        }

        // ROW-LEVEL LOCKING: Lock the inventory record to prevent concurrent modifications
        await tx.$executeRawUnsafe(
          `SELECT * FROM "DrugInventory" WHERE "drugId" = $1 AND "branchId" = $2 FOR UPDATE`,
          item.drugId,
          branchId,
        );

        // Check Inventory
        const inventory = await tx.drugInventory.findUnique({
          where: { drugId_branchId: { drugId: item.drugId, branchId } },
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

        if (!inventory)
          throw new NotFoundException(
            `Inventory not found for drug ${item.drugId}`,
          );

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

          const dispenseFromBatch = Math.min(
            batch.stockQuantity,
            remainingToDispense,
          );
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
              branchId,
              drugId: item.drugId,
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
          totalPrice: touchedBatches.reduce(
            (acc, b) =>
              acc.add(
                new Decimal(b.quantity).mul(new Decimal(b.mrp.toString())),
              ),
            new Decimal(0),
          ),
        });
      }

      // 3. Billing Integration
      const patientCase = await tx.patientCase.findUnique({
        where: { id: dto.caseId },
        select: { patientId: true },
      });

      if (patientCase) {
        const bill = await this.billing.ensureActiveBill(
          dto.caseId,
          patientCase.patientId,
          userId,
          branchId,
          tx,
        );

        if (!bill.isFinalized) {
          await this.billing.addItemsToBill(
            bill.id,
            dispensedResults.map((res) => ({
              serviceName: res.drugName,
              quantity: res.quantity,
              unitPrice: res.totalPrice.div(res.quantity),
              discount: 0,
              itemType: 'PHARMACY',
              referenceId: res.drugId,
            })),
            branchId,
            tx,
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

  async receiveStock(dto: ReceiveStockDto, userId: string, branchId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Ensure Inventory Record
      let inventory = await tx.drugInventory.findUnique({
        where: { drugId_branchId: { drugId: dto.drugId, branchId } },
      });

      if (!inventory) {
        inventory = await tx.drugInventory.create({
          data: {
            drugId: dto.drugId,
            branchId,
            totalStock: 0,
            reorderLevel: 100,
          },
        });
      }

      const beforeTotal = inventory.totalStock;

      // Check if batch exists
      let batch = await tx.drugBatch.findUnique({
        where: { batchNumber: dto.batchNumber },
      });

      let beforeBatchQty = 0;
      if (batch) {
        if (batch.inventoryId !== inventory.id) {
          throw new BadRequestException(
            'Batch number belongs to a different drug inventory',
          );
        }
        beforeBatchQty = batch.stockQuantity;
        batch = await tx.drugBatch.update({
          where: { id: batch.id },
          data: {
            stockQuantity: { increment: dto.quantity },
            expiryDate: new Date(dto.expiryDate),
            manufacturingDate: dto.manufacturingDate
              ? new Date(dto.manufacturingDate)
              : null,
            mrp: dto.mrp,
            purchasePrice: dto.purchasePrice,
            supplierId: dto.supplierId,
          },
        });
      } else {
        batch = await tx.drugBatch.create({
          data: {
            inventoryId: inventory.id,
            batchNumber: dto.batchNumber,
            expiryDate: new Date(dto.expiryDate),
            manufacturingDate: dto.manufacturingDate
              ? new Date(dto.manufacturingDate)
              : null,
            mrp: dto.mrp,
            purchasePrice: dto.purchasePrice,
            stockQuantity: dto.quantity,
            supplierId: dto.supplierId,
          },
        });
      }

      // Update Total Stock
      await tx.drugInventory.update({
        where: { id: inventory.id },
        data: {
          totalStock: { increment: dto.quantity },
          status: 'IN_STOCK',
        },
      });

      // Log Movement
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          batchId: batch.id,
          branchId,
          drugId: dto.drugId,
          movementType: 'IN',
          quantity: dto.quantity,
          beforeQuantity: beforeBatchQty,
          afterQuantity: beforeBatchQty + dto.quantity,
          unitPrice: dto.purchasePrice,
          reason: 'Stock Inward / Purchase',
          performedById: userId,
        },
      });

      return {
        success: true,
        batchId: batch.id,
        newTotal: beforeTotal + dto.quantity,
      };
    });
  }

  async adjustStock(dto: AdjustStockDto, userId: string, branchId: string) {
    return this.prisma.$transaction(async (tx) => {
      const batch = await tx.drugBatch.findUnique({
        where: { id: dto.batchId },
        include: { inventory: true },
      });

      if (!batch) throw new NotFoundException('Batch not found');
      if (batch.inventory.branchId !== branchId)
        throw new BadRequestException('Batch does not belong to this branch');

      const inventory = batch.inventory;
      const drugId = inventory.drugId;

      const beforeQty = batch.stockQuantity;
      let afterQty = beforeQty;

      if (dto.type === 'INCREMENT') {
        afterQty += dto.quantity;
      } else {
        if (beforeQty < dto.quantity)
          throw new BadRequestException(
            'Insufficient stock in batch for adjustment',
          );
        afterQty -= dto.quantity;
      }

      // Update Batch
      await tx.drugBatch.update({
        where: { id: dto.batchId },
        data: { stockQuantity: afterQty },
      });

      // Update Inventory
      await tx.drugInventory.update({
        where: { id: inventory.id },
        data: {
          totalStock:
            dto.type === 'INCREMENT'
              ? { increment: dto.quantity }
              : { decrement: dto.quantity },
        },
      });

      // Log Movement
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          batchId: batch.id,
          branchId,
          drugId,
          movementType: 'ADJUSTMENT',
          quantity: dto.type === 'INCREMENT' ? dto.quantity : -dto.quantity,
          beforeQuantity: beforeQty,
          afterQuantity: afterQty,
          reason: dto.reason || 'Manual adjustment',
          performedById: userId,
        },
      });

      return { success: true, message: 'Stock adjusted', newTotal: afterQty };
    });
  }

  // --- UNIFIED SEARCH ---
  async searchUnifiedDrugs(searchQuery: string, limit: number = 20) {
    const search = searchQuery ? searchQuery.trim() : '';
    
    // Search Normal Drugs
    const normalDrugs = await this.prisma.drug.findMany({
      where: search ? {
        isActive: true,
        OR: [
          { drugName: { contains: search, mode: 'insensitive' } },
          { genericName: { contains: search, mode: 'insensitive' } },
        ]
      } : { isActive: true },
      take: limit,
      orderBy: { drugName: 'asc' },
      include: { inventory: true }
    });

    // Search Simple Drugs
    const simpleDrugs = await this.prisma.simpleDrug.findMany({
      where: search ? {
        isActive: true,
        drugName: { contains: search, mode: 'insensitive' }
      } : { isActive: true },
      take: limit,
      orderBy: { drugName: 'asc' }
    });

    // Map Normal Drugs to unified format
    const unifiedNormal = normalDrugs.map(d => ({
      id: d.id,
      drugName: d.drugName,
      genericName: d.genericName || '',
      category: d.drugCategory || 'NORMAL',
      formulation: d.formulation || 'Tab',
      strength: d.strength || '',
      unitPrice: d.unitPrice || 0,
      drugCategory: d.drugCategory || '',
      inventory: d.inventory || [],
      isSimpleDrug: false
    }));

    // Map Simple Drugs to unified format
    const unifiedSimple = simpleDrugs.map(s => ({
      id: s.id,
      drugName: s.drugName,
      genericName: '', // Simple drugs don't have this
      category: 'SIMPLE',
      formulation: 'Unit',
      strength: '',
      unitPrice: 0,
      drugCategory: 'SIMPLE',
      inventory: [],
      isSimpleDrug: true
    }));

    // Combine and sort
    const allDrugs = [...unifiedNormal, ...unifiedSimple];
    allDrugs.sort((a, b) => a.drugName.localeCompare(b.drugName));
    
    return allDrugs.slice(0, limit);
  }

  async getInventory(branchId: string) {
    return this.prisma.drugInventory.findMany({
      where: { branchId },
      include: {
        drug: true,
        batches: {
          where: { isActive: true },
          orderBy: { expiryDate: 'asc' },
        },
      },
    });
  }

  async getInventoryAlerts(branchId: string) {
    const nearExpiryDate = new Date();
    nearExpiryDate.setMonth(nearExpiryDate.getMonth() + 6);

    const [nearExpiry, expired] = await Promise.all([
      // 2. Near Expiry (within 6 months)
      this.prisma.drugBatch.findMany({
        where: {
          inventory: { branchId },
          stockQuantity: { gt: 0 },
          expiryDate: { lte: nearExpiryDate, gt: new Date() },
          isActive: true,
        },
        include: { inventory: { include: { drug: true } } },
      }),
      // 3. Expired
      this.prisma.drugBatch.findMany({
        where: {
          inventory: { branchId },
          stockQuantity: { gt: 0 },
          expiryDate: { lte: new Date() },
        },
        include: { inventory: { include: { drug: true } } },
      }),
    ]);

    // Low stock needs raw query for field comparison
    const lowStock: any[] = await this.prisma.$queryRaw`
      SELECT di.*, d."drugName"
      FROM "DrugInventory" di
      JOIN "Drug" d ON d.id = di."drugId"
      WHERE di."branchId" = ${branchId} AND (di."totalStock" <= di."reorderLevel" OR di."totalStock" = 0)
    `;

    return { lowStock, nearExpiry, expired };
  }

  async getStockValuation(branchId: string) {
    const batches = await this.prisma.drugBatch.findMany({
      where: {
        inventory: { branchId },
        stockQuantity: { gt: 0 },
      },
    });

    let totalValue = 0;
    batches.forEach((batch) => {
      totalValue += Number(batch.purchasePrice) * batch.stockQuantity;
    });

    return { totalValue, batchCount: batches.length };
  }

  async getMovementHistory(
    filters: { drugId?: string; batchId?: string },
    branchId: string,
  ) {
    return this.prisma.stockMovement.findMany({
      where: {
        branchId,
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

  async returnMedication(
    caseId: string,
    drugId: string,
    batchId: string,
    quantity: number,
    userId: string,
    reason: string,
    branchId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validate Inventory
      const inventory = await tx.drugInventory.findUnique({
        where: { drugId_branchId: { drugId, branchId } },
      });
      if (!inventory) throw new NotFoundException('Inventory not found');

      const batch = await tx.drugBatch.findUnique({
        where: { id: batchId },
      });
      if (!batch) throw new NotFoundException('Batch not found');

      const beforeBatchQty = batch.stockQuantity;
      const afterBatchQty = beforeBatchQty + quantity;

      // 2. Update Stock
      await tx.drugBatch.update({
        where: { id: batchId },
        data: { stockQuantity: { increment: quantity } },
      });

      await tx.drugInventory.update({
        where: { id: inventory.id },
        data: { totalStock: { increment: quantity } },
      });

      // 3. Log Movement
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          batchId,
          branchId,
          drugId,
          movementType: 'IN',
          quantity,
          beforeQuantity: beforeBatchQty,
          afterQuantity: afterBatchQty,
          reason: `Returned from Case ${caseId}: ${reason}`,
          performedById: userId,
          referenceId: caseId,
        },
      });

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          entityType: 'PHARMACY',
          entityId: drugId,
          action: 'RETURN',
          details: `Returned ${quantity} of batch ${batch.batchNumber} for case ${caseId}. Reason: ${reason}`,
        },
      });

      // 5. Billing Adjustment (New Production Requirement)
      const bill = await tx.bill.findUnique({
        where: { caseId },
        include: { items: true },
      });

      if (bill) {
        const refundValue = new Decimal(batch.mrp).mul(quantity);

        // If bill is already finalized, we MUST use a formal refund
        if (bill.isFinalized) {
          // Only process refund if there's paid amount to refund from
          if (new Decimal(bill.paidAmount).gte(refundValue)) {
            await this.billing.processRefund(
              bill.id,
              {
                amount: refundValue.toNumber(),
                reason: `Pharmacy Return: ${reason}`,
              },
              userId,
              branchId,
              undefined,
              tx,
            );
          } else {
            // If not enough paid, we just decrement the balance and gross
            await tx.bill.update({
              where: { id: bill.id },
              data: {
                grossAmount: { decrement: refundValue },
                netAmount: { decrement: refundValue },
                balanceAmount: { decrement: refundValue },
              },
            });
          }
        } else {
          // If bill is still draft, just adjust totals
          await tx.bill.update({
            where: { id: bill.id },
            data: {
              grossAmount: { decrement: refundValue },
              netAmount: { decrement: refundValue },
              balanceAmount: { decrement: refundValue },
            },
          });
        }
      }

      return { success: true, newTotal: afterBatchQty };
    });
  }

  // --- ADMIN: NORMAL DRUGS ---
  async getAllNormalDrugs() {
    return this.prisma.drug.findMany({
      orderBy: { drugName: 'asc' },
    });
  }

  async createNormalDrug(dto: any) {
    return this.prisma.drug.create({
      data: dto,
    });
  }

  async updateNormalDrug(id: string, dto: any) {
    return this.prisma.drug.update({
      where: { id },
      data: dto,
    });
  }

  async deleteNormalDrug(id: string) {
    return this.prisma.drug.update({
      where: { id },
      data: { isActive: false, archivedAt: new Date() },
    });
  }

  // --- ADMIN: SIMPLE DRUGS ---
  async getAllSimpleDrugs() {
    return this.prisma.simpleDrug.findMany({
      orderBy: { drugName: 'asc' },
    });
  }

  async createSimpleDrug(dto: any) {
    return this.prisma.simpleDrug.create({
      data: dto,
    });
  }

  async updateSimpleDrug(id: string, dto: any) {
    return this.prisma.simpleDrug.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSimpleDrug(id: string) {
    return this.prisma.simpleDrug.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
