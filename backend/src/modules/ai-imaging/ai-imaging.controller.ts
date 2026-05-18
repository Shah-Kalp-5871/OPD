import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AiImagingService } from './ai-imaging.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@Controller('ai-imaging')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiImagingController {
  constructor(private readonly imagingService: AiImagingService) {}

  @Post('upload')
  async uploadImage(@Body() body: { patientId: string, modality: string }) {
    return this.imagingService.uploadSimulatedImage(body.patientId, body.modality);
  }

  @Get('patients/:patientId')
  async getImages(@Param('patientId') patientId: string) {
    return this.imagingService.getPatientImages(patientId);
  }

  @Post(':imageId/process')
  async forceProcess(@Param('imageId') imageId: string) {
    return this.imagingService.processImage(imageId);
  }
}
