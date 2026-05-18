import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readReplicaClient: PrismaClient | null = null;

  async onModuleInit() {
    await this.$connect();

    const readReplicaUrl = process.env.DB_READ_REPLICA_URL;
    if (readReplicaUrl) {
      this.readReplicaClient = new PrismaClient({
        datasources: {
          db: {
            url: readReplicaUrl,
          },
        },
      });
      await this.readReplicaClient.$connect();
    }
  }

  async onModuleDestroy() {
    await Promise.all([
      this.$disconnect(),
      this.readReplicaClient ? this.readReplicaClient.$disconnect() : Promise.resolve(),
    ]);
  }

  /**
   * Exposes the read replica client for reading split queries.
   * Falls back gracefully to the primary write client if no replica is configured.
   */
  get read(): PrismaClient {
    return this.readReplicaClient || this;
  }
}
