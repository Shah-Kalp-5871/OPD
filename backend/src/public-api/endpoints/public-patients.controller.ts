import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';
import { Scopes } from '../auth/scopes.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiClientCtx } from '../context/request-api-client.context';
import type { RequestApiClientContext } from '../context/request-api-client.context';
import { PublicApiScopeService } from '../scope/public-api-scope.service';
import { ApiAuditInterceptor } from '../audit/api-audit.interceptor';
import { ApiMetricsInterceptor } from '../metrics/api-metrics.interceptor';
import { ApiQuotaGuard } from '../usage/api-quota.guard'; 

@Controller('api/v2/patients')
@UseGuards(ApiKeyGuard, ApiQuotaGuard, RateLimitGuard)
@UseInterceptors(ApiAuditInterceptor, ApiMetricsInterceptor)
export class PublicPatientsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: PublicApiScopeService,
  ) {}

  @Get()
  @Scopes('patients:read')
  async getPatients(
    @ApiClientCtx() ctx: RequestApiClientContext,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const take = limit ? Math.min(parseInt(limit, 10), 100) : 20;
    const skip = offset ? parseInt(offset, 10) : 0;

    const where = await this.scope.buildPatientWhere(ctx, search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { mobile: { contains: search } },
          ],
        }
      : undefined);

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          mrdNumber: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
          gender: true,
          createdAt: true,
        },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return { total, limit: take, offset: skip, data: patients };
  }

  @Get(':id')
  @Scopes('patients:read')
  async getPatientById(
    @ApiClientCtx() ctx: RequestApiClientContext,
    @Param('id') id: string,
  ) {
    await this.scope.assertPatientAccess(ctx, id);

    const patient = await this.prisma.patient.findUnique({
      where: { id },
      select: {
        id: true,
        mrdNumber: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        gender: true,
        createdAt: true,
        appointments: {
          take: 5,
          orderBy: { appointmentDate: 'desc' },
          select: {
            id: true,
            appointmentDate: true,
            status: true,
            branchId: true,
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  @Post()
  @Scopes('patients:write')
  async registerPatient(
    @ApiClientCtx() ctx: RequestApiClientContext,
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email?: string;
      phoneNumber: string;
      gender: string;
    },
  ) {
    if (!body.firstName || !body.lastName || !body.phoneNumber || !body.gender) {
      throw new BadRequestException(
        'Required fields missing: firstName, lastName, phoneNumber, gender',
      );
    }

    if (body.email) {
      const existingEmail = await this.prisma.patient.findFirst({
        where: { email: body.email },
      });
      if (existingEmail) {
        throw new BadRequestException('Patient with this email already exists');
      }
    }


    const mrdNumber = `MRD-${Math.floor(100000 + Math.random() * 900000)}`;

    return this.prisma.patient.create({
      data: {
        mrdNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email || null,
        mobile: body.phoneNumber,
        gender: body.gender,
      },
      select: {
        id: true,
        mrdNumber: true,
        firstName: true,
        lastName: true,
        mobile: true,
        gender: true,
        createdAt: true,
      },
    });
  }
}
