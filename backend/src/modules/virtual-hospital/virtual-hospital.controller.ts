import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { VirtualHospitalService } from './virtual-hospital.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/v2/virtual-hospital')
@UseGuards(JwtAuthGuard)
export class VirtualHospitalController {
  constructor(private readonly service: VirtualHospitalService) {}

  @Post(':tenantId/admissions')
  admitPatient(
    @Param('tenantId') tenantId: string,
    @Body() body: { patientId: string; assignedTo: string; careLevel: string },
  ) {
    return this.service.admitPatient(tenantId, body.patientId, body.assignedTo, body.careLevel);
  }

  @Patch(':tenantId/admissions/:admissionId/discharge')
  dischargePatient(@Param('tenantId') tenantId: string, @Param('admissionId') admissionId: string) {
    return this.service.dischargePatient(tenantId, admissionId);
  }

  @Patch(':tenantId/admissions/:admissionId/escalate')
  escalatePatient(@Param('tenantId') tenantId: string, @Param('admissionId') admissionId: string) {
    return this.service.escalatePatient(tenantId, admissionId);
  }

  @Post(':tenantId/tasks')
  createTask(
    @Param('tenantId') tenantId: string,
    @Body() body: { admissionId: string; title: string; type: string; assignedTo?: string; dueAt?: string },
  ) {
    return this.service.createTask(tenantId, body.admissionId, body.title, body.type, body.assignedTo, body.dueAt ? new Date(body.dueAt) : undefined);
  }

  @Patch(':tenantId/tasks/:taskId/complete')
  completeTask(@Param('tenantId') tenantId: string, @Param('taskId') taskId: string) {
    return this.service.completeTask(tenantId, taskId);
  }

  @Get(':tenantId/admissions')
  getAdmissions(@Param('tenantId') tenantId: string) {
    return this.service.getAdmissions(tenantId);
  }

  @Get(':tenantId/tasks/missed')
  getMissedTasks(@Param('tenantId') tenantId: string) {
    return this.service.getMissedTasks(tenantId);
  }
}
