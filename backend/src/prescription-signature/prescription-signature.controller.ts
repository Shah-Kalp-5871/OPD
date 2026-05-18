import { Controller, Get, Post, Param, UseGuards, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PrescriptionSignatureService } from './prescription-signature.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('prescription-signature')
export class PrescriptionSignatureController {
  constructor(private readonly signatureService: PrescriptionSignatureService) {}

  @Post('sign/:id')
  @UseGuards(JwtAuthGuard)
  async signPrescription(@Param('id') id: string, @Req() req: any) {
    const actorId = req.user?.id || 'SYSTEM_DOCTOR';
    return this.signatureService.signPrescription(id, actorId);
  }

  @Get('verify/:id')
  async verifyPrescription(@Param('id') id: string) {
    return this.signatureService.verifyPrescription(id);
  }

  @Get('pdf/:id')
  async downloadSignedPDF(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.signatureService.generateSignedPDF(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="medflow-rx-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    });

    res.send(pdfBuffer);
  }
}
