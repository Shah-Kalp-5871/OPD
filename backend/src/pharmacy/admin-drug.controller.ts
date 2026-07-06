import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  CreateNormalDrugDto,
  UpdateNormalDrugDto,
  CreateSimpleDrugDto,
  UpdateSimpleDrugDto,
} from './dto/admin-drug.dto';

@Controller('admin/pharmacy')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDrugController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // NORMAL DRUGS
  @Get('drugs/normal')
  async getAllNormalDrugs() {
    return this.pharmacyService.getAllNormalDrugs();
  }

  @Post('drugs/normal')
  async createNormalDrug(@Body() dto: CreateNormalDrugDto) {
    return this.pharmacyService.createNormalDrug(dto);
  }

  @Put('drugs/normal/:id')
  async updateNormalDrug(
    @Param('id') id: string,
    @Body() dto: UpdateNormalDrugDto,
  ) {
    return this.pharmacyService.updateNormalDrug(id, dto);
  }

  @Delete('drugs/normal/:id')
  async deleteNormalDrug(@Param('id') id: string) {
    return this.pharmacyService.deleteNormalDrug(id);
  }

  // SIMPLE DRUGS
  @Get('drugs/simple')
  async getAllSimpleDrugs() {
    return this.pharmacyService.getAllSimpleDrugs();
  }

  @Post('drugs/simple')
  async createSimpleDrug(@Body() dto: CreateSimpleDrugDto) {
    return this.pharmacyService.createSimpleDrug(dto);
  }

  @Put('drugs/simple/:id')
  async updateSimpleDrug(
    @Param('id') id: string,
    @Body() dto: UpdateSimpleDrugDto,
  ) {
    return this.pharmacyService.updateSimpleDrug(id, dto);
  }

  @Delete('drugs/simple/:id')
  async deleteSimpleDrug(@Param('id') id: string) {
    return this.pharmacyService.deleteSimpleDrug(id);
  }
}
