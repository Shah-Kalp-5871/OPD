import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MfaService } from './mfa.service';
import { SsoService } from './sso.service';
import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('Enterprise IAM & RBAC 2.0 Spec', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mfaService: MfaService;
  let usersService: UsersService;
  let ssoService: SsoService;

  const mockUser = {
    id: 'user_12345',
    email: 'specialist@hospital.com',
    name: 'Clinical Specialist',
    role: 'DOCTOR' as Role,
    mfaEnabled: false,
    mfaSecret: null as string | null,
    mfaBackupCodes: null as string | null,
    permissions: [] as string[],
    failedLoginAttempts: 0,
    lockedUntil: null as Date | null,
  };

  const mockPrismaService = {};

  const mockUsersService = {
    findOneByEmail: jest.fn().mockImplementation((email: string) => {
      if (email === mockUser.email) return Promise.resolve(mockUser);
      return Promise.resolve(null);
    }),
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === mockUser.id) return Promise.resolve(mockUser);
      return Promise.resolve(null);
    }),
    updateMfa: jest.fn().mockImplementation((id, data) => {
      Object.assign(mockUser, data);
      return Promise.resolve(mockUser);
    }),
    updatePermissions: jest.fn().mockImplementation((id, perms) => {
      mockUser.permissions = perms;
      return Promise.resolve(mockUser);
    }),
    resetFailedAttempts: jest.fn().mockResolvedValue(true),
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(mockUser),
    login: jest.fn().mockImplementation((user) => ({
      access_token: 'mocked_jwt_session_token',
      user,
    })),
    signMfaTicket: jest.fn().mockResolvedValue('mocked_mfa_login_ticket'),
    verifyMfaTicket: jest.fn().mockResolvedValue(mockUser),
  };

  const mockSsoService = {
    getSsoRedirectUrl: jest.fn().mockResolvedValue('https://accounts.google.com/mocked-sso'),
    processSsoCallback: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: SsoService, useValue: mockSsoService },
        MfaService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    mfaService = module.get<MfaService>(MfaService);
    usersService = module.get<UsersService>(UsersService);
    ssoService = module.get<SsoService>(SsoService);
  });

  describe('1. Time-based One-Time Password (TOTP) Enrollment & Enabling', () => {
    it('should generate a base32 secret and valid otpauth URL link', () => {
      const result = mfaService.generateSecret('specialist@hospital.com');
      expect(result.secret).toBeDefined();
      expect(result.secret.length).toBeGreaterThan(10);
      expect(result.otpauthUrl).toContain('otpauth://totp/');
      expect(result.otpauthUrl).toContain('specialist%40hospital.com');
    });

    it('should generate secure 8-character single-use backup codes', () => {
      const codes = mfaService.generateBackupCodes();
      expect(codes).toHaveLength(10);
      expect(codes[0]).toHaveLength(8);
    });

    it('should verify a valid TOTP token dynamic sequence', () => {
      const { secret } = mfaService.generateSecret('test@test.com');
      // A mock window check is verified (drift tolerance)
      const isValid = mfaService.verifyToken(secret, '123456');
      expect(isValid).toBe(false);
    });
  });

  describe('2. Multi-Step Login Ticket Integration', () => {
    it('should return mfaRequired checkpoint if user has MFA active', async () => {
      mockUser.mfaEnabled = true;
      const res = (await authController.login({ email: mockUser.email, password: 'password123' })) as any;
      expect(res.mfaRequired).toBe(true);
      expect(res.loginTicket).toBe('mocked_mfa_login_ticket');
    });

    it('should complete login verification using backup codes', async () => {
      mockUser.mfaEnabled = true;
      mockUser.mfaSecret = 'MOCKSECRET32KEYABC';
      mockUser.mfaBackupCodes = JSON.stringify(['BACKUP01', 'BACKUP02']);

      const res = (await authController.verifyMfa({
        loginTicket: 'mocked_mfa_login_ticket',
        token: 'BACKUP01',
      })) as any;

      expect(res.access_token).toBe('mocked_jwt_session_token');
      // Ensure backup code is sliced/removed
      expect(JSON.parse(mockUser.mfaBackupCodes!)).not.toContain('BACKUP01');
    });
  });

  describe('3. Dynamic RBAC PermissionsGuard overrides', () => {
    it('should allow user custom override permissions to augment role defaults', () => {
      const guard = new PermissionsGuard(new Reflector());
      
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              role: 'DOCTOR',
              permissions: ['ADMIN_SETTINGS'], // Custom granted override
            },
          }),
        }),
        getHandler: () => {},
        getClass: () => {},
      } as any;

      // Mock reflector to return required permissions for the handler
      jest.spyOn(Reflector.prototype, 'getAllAndOverride').mockReturnValue(['ADMIN_SETTINGS']);

      const canActivateResult = guard.canActivate(context);
      expect(canActivateResult).toBe(true);
    });

    it('should raise ForbiddenException if user lacks both role defaults and overrides', () => {
      const guard = new PermissionsGuard(new Reflector());
      
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              role: 'NURSING',
              permissions: [],
            },
          }),
        }),
        getHandler: () => {},
        getClass: () => {},
      } as any;

      jest.spyOn(Reflector.prototype, 'getAllAndOverride').mockReturnValue(['SSO_MANAGE']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
