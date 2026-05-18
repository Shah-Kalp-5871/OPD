import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { AppGateway } from '../socket/app.gateway';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly socketGateway: AppGateway,
  ) {}

  /**
   * Check for low stock and notify admins/pharmacists
   */
  async checkLowStock() {
    const lowStockItems = await this.prisma.drugInventory.findMany({
      where: {
        totalStock: { lte: this.prisma.drugInventory.fields.reorderLevel },
        drug: { isActive: true },
      },
      include: { drug: true },
    });

    for (const item of lowStockItems) {
      const title = 'Low Stock Alert';
      const message = `Drug ${item.drug.drugName} is low on stock (${item.totalStock} remaining).`;

      await this.notifyStaffByRole('ADMIN', title, message, 'SEVERE');
      await this.notifyStaffByRole('PHARMACY', title, message, 'SEVERE');
    }
  }

  /**
   * Check for near expiry medicines
   */
  async checkNearExpiry() {
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    const expiringBatches = await this.prisma.drugBatch.findMany({
      where: {
        expiryDate: { lte: ninetyDaysFromNow, gte: new Date() },
        stockQuantity: { gt: 0 },
      },
      include: { inventory: { include: { drug: true } } },
    });

    for (const batch of expiringBatches) {
      const title = 'Near Expiry Alert';
      const message = `Batch ${batch.batchNumber} of ${batch.inventory.drug.drugName} expires on ${batch.expiryDate.toDateString()}.`;

      await this.notifyStaffByRole('PHARMACY', title, message, 'CRITICAL');
    }
  }

  /**
   * Notify all users with a specific role
   */
  private async notifyStaffByRole(
    role: string,
    title: string,
    message: string,
    severity: any,
  ) {
    const users = await this.prisma.user.findMany({
      where: { role: role as any, isActive: true },
    });

    for (const user of users) {
      // 1. Create In-App Notification
      const notification =
        await this.notificationsService.createInAppNotification({
          userId: user.id,
          title,
          message,
          severity,
        });

      // 2. Push via WebSocket
      this.socketGateway.sendToUser(user.id, 'new-notification', notification);
    }
  }
}
