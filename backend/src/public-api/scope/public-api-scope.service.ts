import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestApiClientContext } from '../context/request-api-client.context';

@Injectable()
export class PublicApiScopeService {
  constructor(private readonly prisma: PrismaService) {}

  /** Resolves branch IDs the API client may access. */
  async resolveBranchIds(ctx: RequestApiClientContext): Promise<string[]> {
    if (!ctx.tenantId && !ctx.branchId) {
      throw new ForbiddenException(
        'API client is not bound to a tenant or branch. Contact your administrator.',
      );
    }

    if (ctx.branchId) {
      await this.assertBranchInTenant(ctx.branchId, ctx.tenantId);
      return [ctx.branchId];
    }

    const branches = await this.prisma.branch.findMany({
      where: {
        isActive: true,
        clinic: { tenantId: ctx.tenantId! },
      },
      select: { id: true },
    });

    if (branches.length === 0) {
      throw new ForbiddenException('No active branches found for this tenant');
    }

    return branches.map((b) => b.id);
  }

  async buildAppointmentWhere(
    ctx: RequestApiClientContext,
    extra?: Prisma.AppointmentWhereInput,
  ): Promise<Prisma.AppointmentWhereInput> {
    const branchIds = await this.resolveBranchIds(ctx);
    return {
      ...extra,
      branchId: { in: branchIds },
    };
  }

  async buildPatientWhere(
    ctx: RequestApiClientContext,
    extra?: Prisma.PatientWhereInput,
  ): Promise<Prisma.PatientWhereInput> {
    const branchIds = await this.resolveBranchIds(ctx);
    const tenantScope: Prisma.PatientWhereInput = {
      OR: [
        { appointments: { some: { branchId: { in: branchIds } } } },
        { cases: { some: { branchId: { in: branchIds } } } },
      ],
    };
    if (!extra) return tenantScope;
    return { AND: [tenantScope, extra] };
  }

  async assertAppointmentAccess(ctx: RequestApiClientContext, appointmentId: string) {
    const where = await this.buildAppointmentWhere(ctx, { id: appointmentId });
    const row = await this.prisma.appointment.findFirst({ where, select: { id: true } });
    if (!row) {
      throw new NotFoundException('Appointment not found or access unauthorized');
    }
  }

  async assertPatientAccess(ctx: RequestApiClientContext, patientId: string) {
    const where = await this.buildPatientWhere(ctx, { id: patientId });
    const row = await this.prisma.patient.findFirst({ where, select: { id: true } });
    if (!row) {
      throw new NotFoundException('Patient not found or access unauthorized');
    }
  }

  async assertBranchWritable(ctx: RequestApiClientContext, branchId: string) {
    const allowed = await this.resolveBranchIds(ctx);
    if (!allowed.includes(branchId)) {
      throw new ForbiddenException('Cross-tenant or cross-branch access denied');
    }
  }

  private async assertBranchInTenant(branchId: string, tenantId: string | null) {
    const branch = await this.prisma.branch.findFirst({
      where: {
        id: branchId,
        isActive: true,
        ...(tenantId ? { clinic: { tenantId } } : {}),
      },
      select: { id: true },
    });
    if (!branch) {
      throw new ForbiddenException('Branch is not accessible for this API client');
    }
  }
}
