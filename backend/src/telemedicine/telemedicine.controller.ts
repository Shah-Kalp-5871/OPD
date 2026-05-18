import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TelemedicineService } from './telemedicine.service';
import { GenerateTokenDto } from './dto/telemedicine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/v2/telemedicine')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TelemedicineController {
  constructor(private readonly telemedicineService: TelemedicineService) {}

  @Post('token')
  // Role checking can be adapted based on final patient auth strategy
  async getTurnCredentials(@Body() dto: GenerateTokenDto, @Req() req: any) {
    const userId = req.user.id;
    return this.telemedicineService.generateTurnCredentials(dto.roomId, userId);
  }
}
