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

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.RECEPTION, Role.ADMIN)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  findAll(@Query() query: AppointmentQueryDto) {
    return this.appointmentsService.findAll(query);
  }

  @Get('admin/stats')
  @Roles(Role.ADMIN, Role.RECEPTION)
  getAdminStats(@Query('date') date?: string) {
    return this.appointmentsService.getAdminStats(date);
  }

  @Get('slots')
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  getSlots(@Query('doctorId') doctorId: string, @Query('date') date: string) {
    return this.appointmentsService.getAvailableSlots(doctorId, date);
  }

  @Get(':id')
  @Roles(Role.RECEPTION, Role.ADMIN, Role.DOCTOR)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.RECEPTION)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
    @Req() req: any,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      dto.status,
      req.user.id,
      dto.remarks,
    );
  }

  @Patch(':id/reschedule')
  @Roles(Role.ADMIN, Role.RECEPTION)
  reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleAppointmentDto,
    @Req() req: any,
  ) {
    return this.appointmentsService.reschedule(
      id,
      dto.newDate,
      dto.newTime,
      req.user.id,
      dto.remarks,
    );
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN, Role.RECEPTION)
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelAppointmentDto,
    @Req() req: any,
  ) {
    return this.appointmentsService.cancel(id, dto.reason, req.user.id);
  }

  @Post('check-in')
  @Roles(Role.RECEPTION, Role.ADMIN)
  checkIn(@Body() dto: CheckInAppointmentDto, @Req() req: any) {
    return this.appointmentsService.checkIn(dto, req.user.id);
  }
}
