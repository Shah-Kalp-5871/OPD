import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class ConsumerPaymentsService {
  private readonly logger = new Logger(ConsumerPaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getWallet(patientId: string) {
    const tenantId = this.getTenantId();
    let wallet = await this.prisma.patientWallet.findFirst({
      where: { tenantId, patientId },
    });

    if (!wallet) {
      wallet = await this.prisma.patientWallet.create({
        data: {
          tenantId,
          patientId,
          balance: 250.0,
          loyaltyPoints: 100,
        },
      });
    }

    return wallet;
  }

  async makePayment(patientId: string, amount: number) {
    const tenantId = this.getTenantId();
    const wallet = await this.getWallet(patientId);

    // Perform atomic transaction deduction
    await this.prisma.patientWallet.update({
      where: { id: wallet.id },
      data: {
        balance: Number(wallet.balance) - amount,
        loyaltyPoints: wallet.loyaltyPoints + Math.floor(amount / 10),
      },
    });

    return this.prisma.walletTransaction.create({
      data: {
        tenantId,
        walletId: wallet.id,
        amount,
        type: 'DEBIT',
        description: 'Instant self-billing digital checkout payment',
      },
    });
  }
}