import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('admin/drugs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Post()
  @Roles('ADMIN', 'SUPERADMIN', 'PHARMACY', 'MEDICAL')
  create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugsService.create(createDrugDto);
  }

  @Get('masters/categories')
  @Roles('ADMIN', 'SUPERADMIN', 'DOCTOR', 'PHARMACY', 'NURSING', 'MEDICAL')
  getCategories() {
    return this.drugsService.getCategories();
  }

  @Get('masters/formulations')
  @Roles('ADMIN', 'SUPERADMIN', 'DOCTOR', 'PHARMACY', 'NURSING', 'MEDICAL')
  getFormulations() {
    return this.drugsService.getFormulations();
  }

  @Get()
  @Roles('ADMIN', 'SUPERADMIN', 'DOCTOR', 'PHARMACY', 'NURSING', 'MEDICAL')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;

    return this.drugsService.findAll({
      page: pageNum,
      limit: limitNum,
      search,
      category,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPERADMIN', 'DOCTOR', 'PHARMACY', 'NURSING', 'MEDICAL')
  findOne(@Param('id') id: string) {
    return this.drugsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  update(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto) {
    return this.drugsService.update(id, updateDrugDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.drugsService.remove(id);
  }
}
