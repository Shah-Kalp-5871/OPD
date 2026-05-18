import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { SmartFhirService } from './smart-fhir.service';
import { RegisterSmartAppDto, SmartLaunchDto } from './dto/smart-app.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Permissions } from '../../auth/permissions.decorator';

@Controller('api/v2/smart-fhir')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SmartFhirController {
  constructor(private readonly smartFhirService: SmartFhirService) {}

  @Post(':tenantId/register')
  @Permissions('SYSTEM_ADMIN')
  registerApp(@Param('tenantId') tenantId: string, @Body() dto: RegisterSmartAppDto) {
    return this.smartFhirService.registerApp(tenantId, dto);
  }

  @Get(':tenantId/apps')
  @Permissions('SYSTEM_ADMIN')
  getApps(@Param('tenantId') tenantId: string) {
    return this.smartFhirService.getApps(tenantId);
  }

  @Post(':tenantId/launch')
  createLaunchContext(@Param('tenantId') tenantId: string, @Body() dto: SmartLaunchDto) {
    return this.smartFhirService.createLaunchContext(tenantId, dto);
  }
}
