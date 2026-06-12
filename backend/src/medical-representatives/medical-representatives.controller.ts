import { Controller, Post, Body, Get, Headers, BadRequestException } from '@nestjs/common';
import { MedicalRepresentativesService } from './medical-representatives.service';
import { CheckInMrDto } from './dto/checkin-mr.dto';

@Controller('medical-representatives')
export class MedicalRepresentativesController {
  constructor(private readonly mrService: MedicalRepresentativesService) {}

  @Post('checkin')
  checkIn(
    @Body() checkInMrDto: CheckInMrDto,
    @Headers('x-branch-id') branchId: string,
  ) {
    if (!branchId) throw new BadRequestException('Branch ID is required');
    return this.mrService.checkIn(checkInMrDto, branchId);
  }

  @Get()
  getAll() {
    return this.mrService.getAllMRs();
  }
}
