import { Controller, Get, Patch, Body, UseGuards, Request, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req) {
    const user = await this.usersService.findOne(req.user.id);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  @Patch('me')
  async updateMe(
    @Request() req,
    @Body() body: { name?: string; email?: string; mobile?: string; avatar?: string },
  ) {
    try {
      const user = await this.usersService.updateMe(req.user.id, body);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.message === 'EMAIL_EXISTS') {
        throw new ConflictException('Email address already in use by another user');
      }
      if (error.message === 'MOBILE_EXISTS') {
        throw new ConflictException('Mobile number already in use by another user');
      }
      throw error;
    }
  }
}
