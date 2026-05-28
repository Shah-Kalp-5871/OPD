import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { FollowupsService } from './followups.service';
import { CreateFollowupDto } from './dto/create-followup.dto';
import { UpdateFollowupDto } from './dto/update-followup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('followups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FollowupsController {
  constructor(private readonly followupsService: FollowupsService) {}

  @Post()
  @Roles(Role.DOCTOR, Role.ADMIN)
  create(@Body() createFollowupDto: CreateFollowupDto) {
    return this.followupsService.create(createFollowupDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR, Role.NURSING)
  findAll() {
    return this.followupsService.findAll();
  }

  @Get('pending')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR, Role.NURSING)
  findPending() {
    return this.followupsService.findPending();
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.NURSING, Role.DOCTOR)
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateFollowupDto,
    @Req() req: any
  ) {
    return this.followupsService.updateStatus(id, updateDto, req.user.id);
  }
}
