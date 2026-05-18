import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validate(token: string): Promise<any> {
    const secret = this.configService.get<string>('JWT_SECRET');
    const payload = await this.jwtService.verifyAsync(token, { secret });
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      primaryBranchId: payload.primaryBranchId,
      branchAccess: payload.branchAccess || [],
      branchId: payload.primaryBranchId,
    };
  }
}
