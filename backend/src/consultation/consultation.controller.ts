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
import { BranchGuard } from '../auth/branch.guard';
import { BranchId } from '../auth/branch-id.decorator';
import { FILE_UPLOAD_MULTER_OPTIONS } from '../common/file-storage/file-storage.service';
import { HipaaAudit } from '../audit/hipaa-audit.decorator';
import {
  CreateInvestigationOrderDto,
  CreatePrescriptionDto,
  CreateProcedureSessionDto,
  FinalizeConsultationDto,
  UpdateConsultationDto,
} from './dto/consultation.dto';

@Controller('consultation')
@UseGuards(JwtAuthGuard, RolesGuard, BranchGuard)
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
  @Roles('DOCTOR', 'ADMIN', 'NURSING', 'RECEPTION')
  @HipaaAudit({ actionType: 'VIEWED_PATIENT', module: 'PATIENTS' })
  async getConsultation(
    @Param('caseId') caseId: string,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.getOrCreateConsultation(
      caseId,
      req.user.id,
      branchId,
    );
  }

  @Post(':caseId/save')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  async saveConsultation(
    @Param('caseId') caseId: string,
    @Body() dto: UpdateConsultationDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.updateConsultation(
      caseId,
      dto,
      req.user.id,
      branchId,
    );
  }

  @Post(':caseId/investigations')
  @Roles('DOCTOR', 'ADMIN')
  async placeInvestigationOrders(
    @Param('caseId') caseId: string,
    @Body('orders') orders: CreateInvestigationOrderDto[],
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.createInvestigationOrders(
      caseId,
      orders,
      req.user.id,
      branchId,
    );
  }

  @Post(':caseId/prescriptions')
  @Roles('DOCTOR', 'ADMIN')
  async createPrescription(
    @Param('caseId') caseId: string,
    @Body() dto: CreatePrescriptionDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.createPrescription(
      caseId,
      dto.items,
      dto.notes || '',
      req.user.id,
      branchId,
    );
  }

  @Post(':caseId/procedures')
  @Roles('DOCTOR', 'ADMIN')
  async createProcedureSession(
    @Param('caseId') caseId: string,
    @Body() dto: CreateProcedureSessionDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.createProcedureSession(
      caseId,
      dto.procedureId,
      dto.notes || '',
      dto.scheduledDate,
      dto.scheduledTime,
      dto.sessions,
      dto.isCompletedByDoctor,
      req.user.id,
      branchId,
    );
  }

  @Get(':caseId/images')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  async getClinicalImages(
    @Param('caseId') caseId: string,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.getClinicalImages(caseId, branchId);
  }

  @Post(':caseId/images')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  @UseInterceptors(FileInterceptor('file', FILE_UPLOAD_MULTER_OPTIONS))
  async uploadClinicalImage(
    @Param('caseId') caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { tag?: string; notes?: string },
    @Request() req,
    @BranchId() branchId: string,
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
      branchId,
    );
  }

  @Post(':caseId/finalize')
  @Roles('DOCTOR', 'ADMIN')
  @HipaaAudit({ actionType: 'UPDATED_PATIENT', module: 'PATIENTS' })
  async finalizeConsultation(
    @Param('caseId') caseId: string,
    @Body() dto: FinalizeConsultationDto & { discountPercentage?: number },
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.finalizeConsultation(
      caseId,
      req.user.id,
      dto.nextStage as any,
      branchId,
      dto.discountPercentage,
    );
  }

  @Get(':caseId/investigations')
  @Roles('DOCTOR', 'ADMIN', 'NURSING', 'LAB_TECHNICIAN')
  async getInvestigationOrders(
    @Param('caseId') caseId: string,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.getInvestigationOrders(caseId, branchId);
  }

  @Get('investigations/:orderId')
  @Roles('DOCTOR', 'ADMIN', 'NURSING', 'LAB_TECHNICIAN')
  async getInvestigationOrder(
    @Param('orderId') orderId: string,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.getInvestigationOrderById(
      orderId,
      branchId,
    );
  }

  @Post('investigations/:orderId/upload')
  @Roles('DOCTOR', 'ADMIN', 'LAB_TECHNICIAN')
  @UseInterceptors(FileInterceptor('file', FILE_UPLOAD_MULTER_OPTIONS))
  async uploadInvestigationFile(
    @Param('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.processInvestigationUpload(
      orderId,
      file,
      req.user.id,
      branchId,
    );
  }

  @Get(':caseId/investigations/history')
  @Roles('DOCTOR', 'ADMIN', 'NURSING', 'LAB_TECHNICIAN')
  async getInvestigationHistory(
    @Param('caseId') caseId: string,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.getPatientLabHistory(caseId, branchId);
  }

  @Post('investigations/:orderId/results')
  @Roles('DOCTOR', 'ADMIN', 'LAB_TECHNICIAN', 'NURSING')
  async saveInvestigationResults(
    @Param('orderId') orderId: string,
    @Body('results') results: any[],
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.saveInvestigationResults(
      orderId,
      results,
      req.user.id,
      branchId,
    );
  }

  @Get(':caseId/documents')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  async getPatientDocuments(
    @Param('caseId') caseId: string,
    @BranchId() branchId: string,
  ) {
    return this.consultationService.getPatientDocuments(caseId, branchId);
  }

  @Post(':caseId/documents')
  @Roles('DOCTOR', 'ADMIN', 'NURSING')
  @UseInterceptors(FileInterceptor('file', FILE_UPLOAD_MULTER_OPTIONS))
  async uploadPatientDocument(
    @Param('caseId') caseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { documentType?: string; labName?: string; reportDate?: string },
    @Request() req,
    @BranchId() branchId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Document file is required');
    }

    return this.consultationService.uploadPatientDocument(
      caseId,
      file,
      body.documentType,
      body.labName,
      body.reportDate,
      req.user.id,
      branchId,
    );
  }
}
