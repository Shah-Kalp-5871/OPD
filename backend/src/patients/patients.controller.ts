import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { AddVitalsDto } from './dto/add-vitals.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTION)
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  update(@Param('id') id: string, @Body() updateDto: UpdatePatientDto) {
    return this.patientsService.update(id, updateDto);
  }

  @Get('next-mrd')
  @Roles(Role.ADMIN, Role.RECEPTION)
  async getNextMrd() {
    const nextMrd = await this.patientsService.generateMrdNumber();
    return { mrd: nextMrd };
  }

  @Get('search')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR, Role.NURSING)
  findAll(
    @Query('q') query: string = '',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20'
  ) {
    return this.patientsService.findAll(query, parseInt(page), parseInt(limit));
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR, Role.NURSING, Role.MEDICAL)
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id/profile')
  @Roles(Role.ADMIN, Role.RECEPTION)
  updateProfile(
    @Param('id') id: string, 
    @Body() updateDto: UpdatePatientProfileDto
  ) {
    return this.patientsService.updateProfile(id, updateDto);
  }

  @Post(':id/vitals')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.NURSING, Role.DOCTOR)
  addVitals(
    @Param('id') id: string, 
    @Body() vitalsDto: AddVitalsDto,
    @Request() req
  ) {
    return this.patientsService.addVitals(id, vitalsDto, req.user.id);
  }

  @Get(':id/vitals-history')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.NURSING, Role.DOCTOR)
  getVitalsHistory(@Param('id') id: string) {
    return this.patientsService.getVitalsHistory(id);
  }

  @Post(':id/cases')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  createCase(@Param('id') id: string, @Body() createCaseDto: CreateCaseDto) {
    return this.patientsService.createCase(id, createCaseDto);
  }
}
