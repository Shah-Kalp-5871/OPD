import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WorkforceService } from './workforce.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('workforce')
export class WorkforceController {
  constructor(private readonly workforce: WorkforceService) {}

  @Get('dashboard')
  getDashboard() { return this.workforce.getDashboardData(); }

  @Post('shifts')
  createShift(@Body() body: Parameters<WorkforceService['createShift']>[0]) {
    return this.workforce.createShift(body);
  }

  @Post('shifts/assign')
  assignShift(@Body() body: { employeeId: string; shiftId: string; date: string }) {
    return this.workforce.assignShift(body.employeeId, body.shiftId, new Date(body.date));
  }

  @Post('leaves')
  submitLeave(@Body() body: { employeeId: string; leaveType: string; startDate: string; endDate: string; days: number; reason?: string }) {
    return this.workforce.submitLeaveRequest({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }

  @Post('leaves/:id/approve')
  approveLeave(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.workforce.approveLeave(id, body.approvedBy);
  }

  @Post('forecast')
  generateForecast(@Body() body: { department: string; forecastDate: string; branchId?: string }) {
    return this.workforce.generateStaffingForecast(body.department, new Date(body.forecastDate), body.branchId);
  }
}
