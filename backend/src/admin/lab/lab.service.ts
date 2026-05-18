import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateLabCategoryDto,
  UpdateLabCategoryDto,
} from './dto/lab-category.dto';
import {
  CreateLabParameterDto,
  UpdateLabParameterDto,
} from './dto/lab-parameter.dto';

@Injectable()
export class LabMasterService {
  constructor(private prisma: PrismaService) {}

  // --- Categories ---

  async createCategory(dto: CreateLabCategoryDto) {
    const existing = await this.prisma.labCategory.findFirst({
      where: { OR: [{ name: dto.name }, { code: dto.code }] },
    });
    if (existing)
      throw new ConflictException(
        'Category with this name or code already exists',
      );

    return this.prisma.labCategory.create({ data: dto });
  }

  async getCategories(includeInactive = false) {
    return this.prisma.labCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async updateCategory(id: string, dto: UpdateLabCategoryDto) {
    const category = await this.prisma.labCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.labCategory.update({
      where: { id },
      data: {
        ...dto,
        archivedAt: dto.isActive === false ? new Date() : null,
      },
    });
  }

  async deleteCategory(id: string) {
    // Soft delete / Archive
    return this.updateCategory(id, { isActive: false });
  }

  // --- Parameters ---

  async createParameter(dto: CreateLabParameterDto) {
    const { referenceRanges, ...paramData } = dto;

    return this.prisma.labParameter.create({
      data: {
        ...paramData,
        referenceRanges: referenceRanges
          ? {
              create: referenceRanges,
            }
          : undefined,
      },
      include: { referenceRanges: true },
    });
  }

  async getParameters(query: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
    includeInactive?: boolean;
  }) {
    const {
      categoryId,
      search,
      page = 1,
      limit = 50,
      includeInactive = false,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: includeInactive ? undefined : true,
    };

    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.labParameter.findMany({
        where,
        include: { category: true, referenceRanges: true },
        orderBy: [
          { category: { displayOrder: 'asc' } },
          { displayOrder: 'asc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.labParameter.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getParameterById(id: string) {
    const param = await this.prisma.labParameter.findUnique({
      where: { id },
      include: { category: true, referenceRanges: true },
    });
    if (!param) throw new NotFoundException('Parameter not found');
    return param;
  }

  async updateParameter(id: string, dto: UpdateLabParameterDto) {
    const { referenceRanges, ...paramData } = dto;

    const param = await this.prisma.labParameter.findUnique({ where: { id } });
    if (!param) throw new NotFoundException('Parameter not found');

    return this.prisma.$transaction(async (tx) => {
      // If reference ranges provided, replace them
      if (referenceRanges) {
        await tx.labReferenceRange.deleteMany({ where: { parameterId: id } });
      }

      return tx.labParameter.update({
        where: { id },
        data: {
          ...paramData,
          archivedAt: dto.isActive === false ? new Date() : null,
          referenceRanges: referenceRanges
            ? {
                create: referenceRanges,
              }
            : undefined,
        },
        include: { referenceRanges: true },
      });
    });
  }

  async deleteParameter(id: string) {
    return this.updateParameter(id, { isActive: false });
  }

  // --- Metadata ---

  async getUnits() {
    const params = await this.prisma.labParameter.findMany({
      select: { unit: true },
      distinct: ['unit'],
      where: { unit: { not: null } },
    });
    return params.map((p) => p.unit).filter(Boolean);
  }
}
