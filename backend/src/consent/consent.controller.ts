import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConsentService } from './consent.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateConsentDto } from './dto/consent.dto';
import { FILE_UPLOAD_MULTER_OPTIONS } from '../common/file-storage/file-storage.service';

@Controller('consent')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get('templates')
  @Roles('RECEPTION', 'DOCTOR', 'ADMIN')
  async getTemplates() {
    return this.consentService.getTemplates();
  }

  @Get('case/:caseId')
  @Roles('RECEPTION', 'DOCTOR', 'ADMIN')
  async getCaseConsent(@Param('caseId') caseId: string) {
    return this.consentService.getCaseConsent(caseId);
  }

  @Post('case/:caseId')
  @UseInterceptors(FileInterceptor('signature', FILE_UPLOAD_MULTER_OPTIONS))
  @Roles('RECEPTION', 'DOCTOR', 'ADMIN')
  async saveConsent(
    @Param('caseId') caseId: string,
    @Body() dto: CreateConsentDto,
    @UploadedFile() signature: Express.Multer.File,
    @Request() req,
  ) {
    return this.consentService.saveConsent(
      caseId,
      dto.templateId,
      req.user.id,
      signature,
    );
  }
}
