import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { PatientPortalService } from './patient-portal.service';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient-portal')
export class PatientPortalController {
  constructor(private readonly portalService: PatientPortalService) {}

  @Public()
  @Post('request-otp')
  async requestOtp(@Body('mobile') mobile: string) {
    return this.portalService.requestOtp(mobile);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body('mobile') mobile: string, @Body('otp') otp: string) {
    return this.portalService.verifyOtp(mobile, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.portalService.getProfile(req.user.userId);
  }
}
