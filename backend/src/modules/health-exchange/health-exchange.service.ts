import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterConnectorDto, CreateExchangeLogDto } from './dto/health-exchange.dto';

@Injectable()
export class HealthExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async registerConnector(tenantId: string, dto: RegisterConnectorDto) {
    return this.prisma.integrationConnector.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
        endpoint: dto.endpoint,
        authConfig: dto.authConfig,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getConnectors(tenantId: string) {
    return this.prisma.integrationConnector.findMany({ where: { tenantId } });
  }

  async logExchange(tenantId: string, dto: CreateExchangeLogDto) {
    const connector = await this.prisma.integrationConnector.findFirst({
      where: { id: dto.connectorId, tenantId },
    });

    if (!connector) {
      throw new NotFoundException('Connector not found');
    }

    return this.prisma.exchangeLog.create({
      data: {
        tenantId,
        connectorId: dto.connectorId,
        direction: dto.direction,
        status: dto.status,
        payload: dto.payload,
        error: dto.error,
      },
    });
  }
}
