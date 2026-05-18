import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Logger,
  UseGuards,
  Req,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MfaService } from './mfa.service';
import { IsEmail, IsNotEmpty, MinLength, IsArray } from 'class-validator';
import { HipaaAudit } from '../audit/hipaa-audit.decorator';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { Permissions } from './permissions.decorator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class MfaSetupDto {
  @IsEmail()
  email: string;
}

export class MfaEnableDto {
  @IsNotEmpty()
  secret: string;

  @IsNotEmpty()
  token: string;
}

export class MfaVerifyDto {
  @IsNotEmpty()
  loginTicket: string;

  @IsNotEmpty()
  token: string;
}

export class PermissionsOverrideDto {
  @IsNotEmpty()
  userId: string;

  @IsArray()
  permissions: string[];
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private mfaService: MfaService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Public()
  @Post('login')
  @HipaaAudit({ actionType: 'LOGIN_ATTEMPT', module: 'AUTH' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // If user has enabled multi-factor authentication, return loginTicket instead of full session token
    if (user.mfaEnabled) {
      this.logger.log(`MFA checkpoint initiated for: ${loginDto.email}`);
      const loginTicket = await this.authService.signMfaTicket(user);
      return {
        mfaRequired: true,
        loginTicket,
      };
    }

    this.logger.log(`Successful direct login for: ${loginDto.email}`);
    return this.authService.login(user);
  }

  /**
   * Endpoint to generate the base32 secret and QR config url for authenticator link
   */
  @UseGuards(JwtAuthGuard)
  @Post('mfa/setup')
  async setupMfa(@Req() req: any) {
    const user = req.user;
    const { secret, otpauthUrl } = this.mfaService.generateSecret(user.email);
    
    return {
      secret,
      otpauthUrl,
      message: 'MFA setup initiated. Scan the QR code configuration and verify the token to enable MFA.',
    };
  }

  /**
   * Endpoint to verify the initial enrollment token and activate MFA
   */
  @UseGuards(JwtAuthGuard)
  @Post('mfa/enable')
  @HipaaAudit({ actionType: 'MFA_ENABLE', module: 'AUTH' })
  async enableMfa(@Req() req: any, @Body() dto: MfaEnableDto) {
    const user = req.user;
    const isValid = this.mfaService.verifyToken(dto.secret, dto.token);

    if (!isValid) {
      throw new BadRequestException('MFA verification token is invalid or out of sync');
    }

    // Generate single-use dynamic backup codes
    const backupCodes = this.mfaService.generateBackupCodes();

    await this.usersService.updateMfa(user.id, {
      mfaSecret: dto.secret,
      mfaEnabled: true,
      mfaBackupCodes: JSON.stringify(backupCodes),
    });

    this.logger.log(`MFA enabled successfully for user ID: ${user.id}`);

    return {
      success: true,
      message: 'Multi-factor Authentication enabled successfully.',
      backupCodes,
    };
  }

  /**
   * Endpoint to verify 6-digit TOTP tokens or backup codes to finalize logins
   */
  @Public()
  @Post('mfa/verify')
  @HipaaAudit({ actionType: 'MFA_VERIFY', module: 'AUTH' })
  async verifyMfa(@Body() dto: MfaVerifyDto) {
    const user = await this.authService.verifyMfaTicket(dto.loginTicket);

    if (!user.mfaSecret) {
      throw new BadRequestException('MFA is not configured for this user profile');
    }

    // 1. Verify TOTP 6-digit token
    let isCodeValid = this.mfaService.verifyToken(user.mfaSecret, dto.token);

    // 2. Fallback to check matching active backup codes
    let isBackupUsed = false;
    if (!isCodeValid && user.mfaBackupCodes) {
      const backupCodesList: string[] = JSON.parse(user.mfaBackupCodes);
      const codeIndex = backupCodesList.indexOf(dto.token.toUpperCase());

      if (codeIndex !== -1) {
        isCodeValid = true;
        isBackupUsed = true;
        
        // Remove verified backup code to make it single-use
        backupCodesList.splice(codeIndex, 1);
        await this.usersService.updateMfa(user.id, {
          mfaBackupCodes: JSON.stringify(backupCodesList),
        });
      }
    }

    if (!isCodeValid) {
      throw new UnauthorizedException('Multi-factor authentication code is invalid or has expired');
    }

    this.logger.log(`MFA verified successfully for user: ${user.email} (Backup code used: ${isBackupUsed})`);
    
    // Reset failed login attempts on successful authentication
    if (user.failedLoginAttempts > 0) {
      await this.usersService.resetFailedAttempts(user.id);
    }

    return this.authService.login(user);
  }

  /**
   * Endpoint to disable MFA security layer
   */
  @UseGuards(JwtAuthGuard)
  @Post('mfa/disable')
  @HipaaAudit({ actionType: 'MFA_DISABLE', module: 'AUTH' })
  async disableMfa(@Req() req: any, @Body('token') token: string) {
    const userObj = await this.usersService.findOne(req.user.id);
    if (!userObj || !userObj.mfaSecret || !userObj.mfaEnabled) {
      throw new BadRequestException('MFA is not enabled on this profile');
    }

    const isValid = this.mfaService.verifyToken(userObj.mfaSecret, token);
    if (!isValid) {
      throw new BadRequestException('Verification code is invalid');
    }

    await this.usersService.updateMfa(userObj.id, {
      mfaSecret: null,
      mfaEnabled: false,
      mfaBackupCodes: null,
    });

    this.logger.log(`MFA deactivated successfully for user: ${userObj.email}`);
    return { success: true, message: 'MFA has been successfully deactivated.' };
  }

  /**
   * Admin-restricted route to assign override permission vectors to enterprise seats
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('ADMIN_SETTINGS', 'SSO_MANAGE')
  @Post('permissions/override')
  @HipaaAudit({ actionType: 'PERMISSION_OVERRIDE_UPDATE', module: 'AUTH' })
  async overridePermissions(@Body() dto: PermissionsOverrideDto) {
    const targetUser = await this.usersService.findOne(dto.userId);
    if (!targetUser) {
      throw new BadRequestException('Target user profile not found');
    }

    await this.usersService.updatePermissions(dto.userId, dto.permissions);
    
    this.logger.log(`Permissions overridden for user ID: ${dto.userId}. New permissions: ${dto.permissions.join(', ')}`);

    return {
      success: true,
      message: 'User-level specific override permissions mapped successfully.',
      userId: dto.userId,
      permissions: dto.permissions,
    };
  }
}

function isValidToken(valid: boolean): boolean {
  return valid;
}
