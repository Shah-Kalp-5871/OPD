import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const UPI_ID_KEY = 'PAYMENT_UPI_ID';
const UPI_PAYEE_NAME_KEY = 'PAYMENT_UPI_PAYEE_NAME';

@Injectable()
export class PaymentSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<{ upiId: string; upiPayeeName: string }> {
    const settings = await this.prisma.masterSetting.findMany({
      where: {
        key: { in: [UPI_ID_KEY, UPI_PAYEE_NAME_KEY] },
      },
    });

    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return {
      upiId: map[UPI_ID_KEY] ?? '',
      upiPayeeName: map[UPI_PAYEE_NAME_KEY] ?? '',
    };
  }

  async updateSettings(dto: { upiId: string; upiPayeeName?: string }) {
    const upsert = (key: string, value: string) =>
      this.prisma.masterSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });

    await Promise.all([
      upsert(UPI_ID_KEY, dto.upiId),
      upsert(UPI_PAYEE_NAME_KEY, dto.upiPayeeName ?? ''),
    ]);

    return { success: true, upiId: dto.upiId, upiPayeeName: dto.upiPayeeName ?? '' };
  }
}
