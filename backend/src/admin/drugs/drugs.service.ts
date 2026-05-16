import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';

@Injectable()
export class DrugsService {
  constructor(private prisma: PrismaService) {}

  async create(createDrugDto: CreateDrugDto) {
    return this.prisma.drug.create({
      data: createDrugDto,
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isActive?: boolean;
  }) {
    const { page = 1, limit = 20, search, category, isActive } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DrugWhereInput = {};

    if (search) {
      where.OR = [
        { drugName: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.drugCategory = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [total, data] = await Promise.all([
      this.prisma.drug.count({ where }),
      this.prisma.drug.findMany({
        where,
        skip,
        take: limit,
        orderBy: { drugName: 'asc' },
        include: { inventory: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const drug = await this.prisma.drug.findUnique({
      where: { id },
      include: { inventory: true },
    });

    if (!drug) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }

    return drug;
  }

  async update(id: string, updateDrugDto: UpdateDrugDto) {
    const drug = await this.findOne(id);
    return this.prisma.drug.update({
      where: { id: drug.id },
      data: updateDrugDto,
    });
  }

  async remove(id: string) {
    const drug = await this.findOne(id);
    // Soft delete by setting isActive to false
    return this.prisma.drug.update({
      where: { id: drug.id },
      data: {
        isActive: false,
        archivedAt: new Date(),
      },
    });
  }

  async getCategories() {
    const categories = await this.prisma.drug.findMany({
      select: { drugCategory: true },
      distinct: ['drugCategory'],
      where: { isActive: true },
    });
    return categories.map((c) => c.drugCategory);
  }

  async getFormulations() {
    const formulations = await this.prisma.drug.findMany({
      select: { formulation: true },
      distinct: ['formulation'],
      where: { isActive: true },
    });
    return formulations.map((f) => f.formulation);
  }
}
