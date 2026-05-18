import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcedureDto, UpdateProcedureDto } from './dto/procedure.dto';

@Injectable()
export class ProcedureMasterService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProcedureDto) {
    if (dto.code) {
      const existing = await this.prisma.procedure.findUnique({
        where: { code: dto.code },
      });
      if (existing)
        throw new ConflictException('Procedure with this code already exists');
    }

    const { consumables, ...procedureData } = dto;

    return this.prisma.procedure.create({
      data: {
        ...procedureData,
        consumableTemplates: consumables ? { create: consumables } : undefined,
      },
      include: { consumableTemplates: true },
    });
  }

  async findAll(query: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    includeInactive?: boolean;
  }) {
    const {
      search,
      category,
      page = 1,
      limit = 20,
      includeInactive = false,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: includeInactive ? undefined : true,
    };

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.procedure.findMany({
        where,
        include: { consumableTemplates: true },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.procedure.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findById(id: string) {
    const proc = await this.prisma.procedure.findUnique({
      where: { id },
      include: { consumableTemplates: true },
    });
    if (!proc) throw new NotFoundException('Procedure not found');
    return proc;
  }

  async update(id: string, dto: UpdateProcedureDto) {
    const proc = await this.prisma.procedure.findUnique({ where: { id } });
    if (!proc) throw new NotFoundException('Procedure not found');

    const { consumables, ...procedureData } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (consumables !== undefined) {
        await tx.procedureConsumable.deleteMany({ where: { procedureId: id } });
      }

      return tx.procedure.update({
        where: { id },
        data: {
          ...procedureData,
          archivedAt:
            dto.isActive === false
              ? new Date()
              : proc.archivedAt === null
                ? null
                : undefined,
          consumableTemplates: consumables
            ? { create: consumables }
            : undefined,
        },
        include: { consumableTemplates: true },
      });
    });
  }

  async archive(id: string) {
    return this.update(id, { isActive: false });
  }

  async getCategories() {
    const result = await this.prisma.procedure.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { category: { not: null } },
      orderBy: { category: 'asc' },
    });
    return result.map((r) => r.category).filter(Boolean);
  }
}
