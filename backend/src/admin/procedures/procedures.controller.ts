import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProcedureMasterService } from './procedures.service';
import { CreateProcedureDto, UpdateProcedureDto } from './dto/procedure.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/procedures')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcedureMasterController {
  constructor(private readonly service: ProcedureMasterService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  create(@Body() dto: CreateProcedureDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTOR, Role.NURSING)
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.service.findAll({
      search,
      category,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      includeInactive: includeInactive === 'true',
    });
  }

  @Get('masters/categories')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTOR, Role.NURSING)
  getCategories() {
    return this.service.getCategories();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTOR, Role.NURSING)
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProcedureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  archive(@Param('id') id: string) {
    return this.service.archive(id);
  }
}
