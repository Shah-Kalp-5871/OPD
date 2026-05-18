import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CheckInAppointmentDto } from './dto/check-in-appointment.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';

import { BranchId } from '../common/decorators/branch-id.decorator';
import { BranchGuard } from '../common/guards/branch.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard, BranchGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.RECEPTION, Role.ADMIN)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @BranchId() branchId: string,
  ) {
    return this.appointmentsService.create(createAppointmentDto, branchId);
  }

  @Get()
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  findAll(@Query() query: AppointmentQueryDto, @BranchId() branchId: string) {
    return this.appointmentsService.findAll(query, branchId);
  }

  @Get('admin/stats')
  @Roles(Role.ADMIN, Role.RECEPTION)
  getAdminStats(
    @Query('date') date: string | undefined,
    @BranchId() branchId: string,
  ) {
    return this.appointmentsService.getAdminStats(branchId, date);
  }

  @Get('slots')
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  getSlots(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
    @BranchId() branchId: string,
  ) {
    return this.appointmentsService.getAvailableSlots(doctorId, date, branchId);
  }

  @Get(':id')
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  findOne(@Param('id') id: string, @BranchId() branchId: string) {
    return this.appointmentsService.findOne(id, branchId);
  }

  @Patch(':id/status')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.RECEPTION)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
    @Req() req: any,
    @BranchId() branchId: string,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      dto.status,
      req.user.id,
      dto.remarks,
      branchId,
    );
  }

  @Patch(':id/reschedule')
  @Roles(Role.ADMIN, Role.RECEPTION)
  reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleAppointmentDto,
    @Req() req: any,
    @BranchId() branchId: string,
  ) {
    return this.appointmentsService.reschedule(
      id,
      dto.newDate,
      dto.newTime,
      req.user.id,
      dto.remarks,
      branchId,
    );
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN, Role.RECEPTION)
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelAppointmentDto,
    @Req() req: any,
    @BranchId() branchId: string,
  ) {
    return this.appointmentsService.cancel(
      id,
      dto.reason,
      req.user.id,
      branchId,
    );
  }

  @Post('check-in')
  @Roles(Role.RECEPTION, Role.ADMIN)
  checkIn(
    @Body() dto: CheckInAppointmentDto,
    @Req() req: any,
    @BranchId() branchId: string,
  ) {
    return this.appointmentsService.checkIn(dto, req.user.id, branchId);
  }
}
