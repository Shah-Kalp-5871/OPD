import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { HrmsService } from './hrms.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('hrms')
export class HrmsController {
  constructor(private readonly hrms: HrmsService) {}

  @Get('dashboard')
  getDashboard() { return this.hrms.getDashboardData(); }

  @Get('employees')
  getEmployees(@Query('status') status?: string, @Query('departmentId') departmentId?: string) {
    return this.hrms.getEmployees({ status, departmentId });
  }

  @Post('employees')
  createEmployee(@Body() body: Parameters<HrmsService['createEmployee']>[0]) {
    return this.hrms.createEmployee(body);
  }

  @Post('attendance')
  recordAttendance(@Body() body: { employeeId: string; date: string; checkIn?: string; checkOut?: string; status?: string }) {
    return this.hrms.recordAttendance(
      body.employeeId,
      new Date(body.date),
      body.checkIn ? new Date(body.checkIn) : undefined,
      body.checkOut ? new Date(body.checkOut) : undefined,
      body.status,
    );
  }

  @Post('departments')
  createDepartment(@Body() body: { name: string; code: string; branchId?: string }) {
    return this.hrms.createDepartment(body.name, body.code, body.branchId);
  }

  @Get('departments')
  getDepartments() { return this.hrms.getDepartments(); }
}
