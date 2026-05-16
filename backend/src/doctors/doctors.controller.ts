import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  SetMetadata,
  Logger,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  private readonly logger = new Logger(DoctorsController.name);

  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createDoctorDto: CreateDoctorDto) {
    this.logger.log(
      'Creating doctor with data: ' + JSON.stringify(createDoctorDto),
    );
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTION)
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTION)
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }
}
