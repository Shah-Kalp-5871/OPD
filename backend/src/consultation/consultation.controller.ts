import {
  BadRequestException,
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
import { ConsultationService } from './consultation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FILE_UPLOAD_MULTER_OPTIONS } from '../common/file-storage/file-storage.service';
import {
  CreateInvestigationOrderDto,
  CreatePrescriptionDto,
  CreateProcedureSessionDto,
  FinalizeConsultationDto,
  UpdateConsultationDto,
} from './dto/consultation.dto';

@Controller('consultation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Get('lab/masters')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  async getLabMasters() {
    return this.consultationService.getLabMasters();
  }

  @Get('pharmacy/drugs')
  @Roles('DOCTOR', 'ADMIN', 'PHARMACY')
  async getDrugs() {
    return this.consultationService.getDrugs();
  }

  @Get('clinical/procedures')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  async getProcedures() {
    return this.consultationService.getProcedures();
  }

  @Get(':caseId')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  async getConsultation(@Param('caseId') caseId: string, @Request() req) {
    return this.consultationService.getOrCreateConsultation(
      caseId,
      req.user.id,
    );
  }

  @Post(':caseId/save')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  async saveConsultation(
    @Param('caseId') caseId: string,
    @Body() dto: UpdateConsultationDto,
    @Request() req,
  ) {
    return this.consultationService.updateConsultation(
      caseId,
      dto,
      req.user.id,
    );
  }

  @Post(':caseId/investigations')
  @Roles('DOCTOR', 'ADMIN')
  async placeInvestigationOrders(
    @Param('caseId') caseId: string,
    @Body('orders') orders: CreateInvestigationOrderDto[],
    @Request() req,
  ) {
    return this.consultationService.createInvestigationOrders(
      caseId,
      orders,
      req.user.id,
    );
  }

  @Post(':caseId/prescriptions')
  @Roles('DOCTOR', 'ADMIN')
  async createPrescription(
    @Param('caseId') caseId: string,
    @Body() dto: CreatePrescriptionDto,
    @Request() req,
  ) {
    return this.consultationService.createPrescription(
      caseId,
      dto.items,
      dto.notes || '',
      req.user.id,
    );
  }

  @Post(':caseId/procedures')
  @Roles('DOCTOR', 'ADMIN')
  async createProcedureSession(
    @Param('caseId') caseId: string,
    @Body() dto: CreateProcedureSessionDto,
    @Request() req,
  ) {
    return this.consultationService.createProcedureSession(
      caseId,
      dto.procedureId,
      dto.notes || '',
      req.user.id,
    );
  }

  @Get(':caseId/images')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  async getClinicalImages(@Param('caseId') caseId: string) {
    return this.consultationService.getClinicalImages(caseId);
  }

  @Post(':caseId/images')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  @UseInterceptors(FileInterceptor('file', FILE_UPLOAD_MULTER_OPTIONS))
  async uploadClinicalImage(
    @Param('caseId') caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { tag?: string; notes?: string },
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('Clinical image file is required');
    }

    return this.consultationService.saveClinicalImageWithFile(
      caseId,
      file,
      body.tag,
      body.notes,
      req.user.id,
    );
  }

  @Post(':caseId/finalize')
  @Roles('DOCTOR', 'ADMIN')
  async finalizeConsultation(
    @Param('caseId') caseId: string,
    @Body() dto: FinalizeConsultationDto,
    @Request() req,
  ) {
    return this.consultationService.finalizeConsultation(
      caseId,
      req.user.id,
      dto.nextStage as any,
    );
  }

  @Get(':caseId/investigations')
  @Roles('DOCTOR', 'ADMIN', 'NURSING', 'LAB_TECHNICIAN')
  async getInvestigationOrders(@Param('caseId') caseId: string) {
    return this.consultationService.getInvestigationOrders(caseId);
  }

  @Get('investigations/:orderId')
  @Roles('DOCTOR', 'ADMIN', 'NURSING', 'LAB_TECHNICIAN')
  async getInvestigationOrder(@Param('orderId') orderId: string) {
    return this.consultationService.getInvestigationOrderById(orderId);
  }

  @Post('investigations/:orderId/upload')
  @Roles('DOCTOR', 'ADMIN', 'LAB_TECHNICIAN')
  @UseInterceptors(FileInterceptor('file', FILE_UPLOAD_MULTER_OPTIONS))
  async uploadInvestigationFile(
    @Param('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.consultationService.processInvestigationUpload(
      orderId,
      file,
      req.user.id,
    );
  }
}
