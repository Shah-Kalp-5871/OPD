import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  SetMetadata,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.staffService.findAll({
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      includeInactive: includeInactive === 'true',
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }
}
