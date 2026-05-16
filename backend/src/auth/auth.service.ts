import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        `Account is locked until ${user.lockedUntil.toLocaleString()}`,
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account disabled');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      // Track failed attempt
      await this.usersService.incrementFailedAttempts(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    if (user.failedLoginAttempts > 0) {
      await this.usersService.resetFailedAttempts(user.id);
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      primaryBranchId: user.primaryBranchId,
      branchAccess: user.branchAccess?.map((b: any) => b.branchId) || [],
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        primaryBranchId: user.primaryBranchId,
        branchAccess: user.branchAccess?.map((b: any) => b.branchId) || [],
      },
    };
  }
}
