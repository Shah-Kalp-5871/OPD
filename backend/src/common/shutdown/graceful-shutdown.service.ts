import { Injectable, OnApplicationShutdown, BeforeApplicationShutdown, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bullmq';

@Injectable()
export class GracefulShutdownService implements BeforeApplicationShutdown, OnApplicationShutdown {
  private readonly logger = new Logger(GracefulShutdownService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Executed BEFORE the application starts closing.
   * Perfect place for connection draining and stopping incoming job pickups.
   */
  async beforeApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(`[GracefulShutdown] SIGTERM/SIGINT signal received (${signal}). Initiating connection draining...`);

    // 1. Give active HTTP requests and WebSocket transactions time to complete gracefully
    this.logger.log('[GracefulShutdown] Allowing 10 seconds for active connections to drain...');
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  /**
   * Executed during the application shutdown phase.
   * Clean up database pools and key-value connection clients.
   */
  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log('[GracefulShutdown] Reclaiming database connections...');
    
    try {
      await this.prisma.$disconnect();
      this.logger.log('[GracefulShutdown] Prisma database client disconnected successfully.');
    } catch (error) {
      this.logger.error('[GracefulShutdown] Error disconnecting Prisma client:', error);
    }

    this.logger.log('[GracefulShutdown] Graceful shutdown lifecycle completed.');
  }
}
