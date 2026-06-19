import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileStorageService } from '../common/file-storage/file-storage.service';

@Injectable()
export class ConsentService {
  constructor(
    private prisma: PrismaService,
    private readonly fileStorage: FileStorageService,
  ) {}

  async getTemplates() {
    return this.prisma.consentTemplate.findMany({
      where: { isActive: true },
    });
  }

  async getCaseConsent(caseId: string) {
    return this.prisma.consentForm.findMany({
      where: { caseId },
      include: { template: true },
    });
  }

  async saveConsent(
    caseId: string,
    templateId: string,
    signedById: string,
    signatureFile?: Express.Multer.File,
    customRisks?: string,
    doctorNotes?: string,
  ) {
    const data: any = {
      caseId,
      templateId,
      signedById,
      status: 'SIGNED',
      signedAt: new Date(),
      customRisks,
      doctorNotes,
    };

    if (signatureFile) {
      const savedFile = await this.fileStorage.saveFile(
        signatureFile,
        'consent',
        signedById,
      );

      return this.prisma.consentForm.create({
        data: {
          ...data,
          signatureUrl: savedFile.url,
          mimeType: savedFile.mimeType,
          storedPath: savedFile.path,
          sha256Hash: savedFile.sha256Hash,
        },
        include: { template: true },
      });
    }

    return this.prisma.consentForm.create({
      data,
      include: { template: true },
    });
  }
}
