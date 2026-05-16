import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LabMasterService } from './lab.service';
import { CreateLabCategoryDto, UpdateLabCategoryDto } from './dto/lab-category.dto';
import { CreateLabParameterDto, UpdateLabParameterDto } from './dto/lab-parameter.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/lab')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabMasterController {
  constructor(private readonly labService: LabMasterService) {}

  // --- Categories ---

  @Post('categories')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  createCategory(@Body() dto: CreateLabCategoryDto) {
    return this.labService.createCategory(dto);
  }

  @Get('categories')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTOR, Role.LAB_TECHNICIAN)
  getCategories(@Query('includeInactive') includeInactive: string) {
    return this.labService.getCategories(includeInactive === 'true');
  }

  @Patch('categories/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  updateCategory(@Param('id') id: string, @Body() dto: UpdateLabCategoryDto) {
    return this.labService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  deleteCategory(@Param('id') id: string) {
    return this.labService.deleteCategory(id);
  }

  // --- Parameters ---

  @Post('parameters')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  createParameter(@Body() dto: CreateLabParameterDto) {
    return this.labService.createParameter(dto);
  }

  @Get('parameters')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTOR, Role.LAB_TECHNICIAN)
  getParameters(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.labService.getParameters({
      categoryId,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      includeInactive: includeInactive === 'true',
    });
  }

  @Get('parameters/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTOR, Role.LAB_TECHNICIAN)
  getParameterById(@Param('id') id: string) {
    return this.labService.getParameterById(id);
  }

  @Patch('parameters/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  updateParameter(@Param('id') id: string, @Body() dto: UpdateLabParameterDto) {
    return this.labService.updateParameter(id, dto);
  }

  @Delete('parameters/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  deleteParameter(@Param('id') id: string) {
    return this.labService.deleteParameter(id);
  }

  // --- Masters ---

  @Get('masters/units')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTOR, Role.LAB_TECHNICIAN)
  getUnits() {
    return this.labService.getUnits();
  }
}
