import { Controller, Post, Body, Req, Header, UseGuards } from '@nestjs/common';
import { Hl7Service } from './hl7.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/v2/hl7')
export class Hl7Controller {
  constructor(private readonly hl7Service: Hl7Service) {}

  private extractTenantId(req: any): string {
    const tenantId = req.headers['x-tenant-id'] || req.tenantId || req.user?.tenantId || 'default-tenant-id';
    return typeof tenantId === 'string' ? tenantId : 'default-tenant-id';
  }

  @Post('ingest')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'text/plain')
  async ingestHl7Message(@Body() rawHl7: string, @Req() req: any): Promise<string> {
    const tenantId = this.extractTenantId(req);
    // Ingest the message asynchronously, returning a synchronous HL7 ACK block
    return this.hl7Service.ingestMessage(rawHl7, tenantId);
  }
}
