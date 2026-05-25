import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { AddVitalsDto } from './dto/add-vitals.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { PatientQueryDto } from './dto/patient-query.dto';
import { AddPatientDocumentDto } from './dto/add-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { HipaaAudit } from '../audit/hipaa-audit.decorator';

import { BranchId } from '../common/decorators/branch-id.decorator';
import { BranchGuard } from '../common/guards/branch.guard';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard, BranchGuard)
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

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR, Role.NURSING)
  @HipaaAudit({ actionType: 'VIEWED_PATIENT', module: 'PATIENTS' })
  findAll(@Query() query: PatientQueryDto) {
    // If 'search' is passed instead of 'q', map it to 'q'
    if ((query as any).search && !query.q) {
      query.q = (query as any).search;
    }
    return this.patientsService.findAll(query);
  }

  @Get('search')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR, Role.NURSING)
  @HipaaAudit({ actionType: 'VIEWED_PATIENT', module: 'PATIENTS' })
  search(@Query() query: PatientQueryDto) {
    return this.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR, Role.NURSING, Role.MEDICAL, Role.SUPERADMIN, Role.BRANCH_ADMIN)
  @HipaaAudit({ actionType: 'VIEWED_PATIENT', module: 'PATIENTS' })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Get('mrd/:mrd')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR, Role.NURSING, Role.SUPERADMIN, Role.BRANCH_ADMIN)
  @HipaaAudit({ actionType: 'VIEWED_PATIENT', module: 'PATIENTS' })
  findByMrd(@Param('mrd') mrd: string) {
    return this.patientsService.findByMrd(mrd);
  }

  @Patch(':id/profile')
  @Roles(Role.ADMIN, Role.RECEPTION)
  @HipaaAudit({ actionType: 'UPDATED_PATIENT', module: 'PATIENTS' })
  updateProfile(
    @Param('id') id: string,
    @Body() updateDto: UpdatePatientProfileDto,
  ) {
    return this.patientsService.updateProfile(id, updateDto);
  }

  @Post(':id/vitals')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.NURSING, Role.DOCTOR)
  addVitals(
    @Param('id') id: string,
    @Body() vitalsDto: AddVitalsDto,
    @Request() req,
  ) {
    return this.patientsService.addVitals(
      id,
      vitalsDto,
      req.user.id,
      req.user.branchId,
    );
  }

  @Get(':id/vitals-history')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.NURSING, Role.DOCTOR)
  getVitalsHistory(@Param('id') id: string) {
    return this.patientsService.getVitalsHistory(id);
  }

  @Get(':id/history')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  getHistory(@Param('id') id: string) {
    return this.patientsService.getHistory(id);
  }

  @Get(':id/billing')
  @Roles(Role.ADMIN, Role.RECEPTION)
  getBilling(@Param('id') id: string) {
    return this.patientsService.getBilling(id);
  }

  @Get(':id/appointments')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  getAppointments(@Param('id') id: string) {
    return this.patientsService.getAppointments(id);
  }

  @Post(':id/cases')
  @Roles(Role.ADMIN, Role.RECEPTION)
  createCase(
    @Param('id') id: string,
    @Body() createCaseDto: CreateCaseDto,
    @BranchId() branchId: string,
  ) {
    return this.patientsService.createCase(id, createCaseDto, branchId);
  }

  @Post(':id/documents')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  addDocument(
    @Param('id') id: string,
    @Body() dto: AddPatientDocumentDto,
  ) {
    return this.patientsService.addDocument(id, dto);
  }

  @Delete(':id/documents/:docId')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  deleteDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
  ) {
    return this.patientsService.deleteDocument(id, docId);
  }
}
