import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class DashboardTemplateService {
  private readonly logger = new Logger(DashboardTemplateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  async createTemplate(data: {
    templateName: string;
    layoutConfig: any;
    isDefault?: boolean;
    userId?: string;
  }) {
    const tenantId = this.getTenantId();
    return this.prisma.savedDashboard.create({
      data: {
        tenantId,
        userId: data.userId || 'system',
        name: data.templateName,
        description: data.isDefault ? 'Default dashboard' : '',
        isPublic: true,
        layout: data.layoutConfig,
      },
    });
  }

  async listTemplates() {
    const tenantId = this.getTenantId();
    return this.prisma.savedDashboard.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async getTemplate(id: string) {
    const tenantId = this.getTenantId();
    const template = await this.prisma.savedDashboard.findFirst({
      where: { id, tenantId },
    });
    if (!template) {
      throw new NotFoundException(`Dashboard template ${id} not found`);
    }
    return template;
  }
}
