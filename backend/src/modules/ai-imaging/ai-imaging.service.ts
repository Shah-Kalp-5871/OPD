import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class AiImagingService {
  private readonly logger = new Logger(AiImagingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  async processImage(imageId: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    if (!tenantId) throw new Error('Tenant context missing');

    const image = await this.prisma.medicalImage.findUnique({
      where: { id: imageId, tenantId },
    });

    if (!image) throw new Error('Image not found');

    this.logger.log(`Starting AI processing for image ${imageId} (Modality: ${image.modality})`);

    // Simulate Image AI processing pipeline (e.g., calling an external DICOM inference model)
    await this.prisma.medicalImage.update({
      where: { id: imageId },
      data: { status: 'ANALYZING' },
    });

    // Simulated Findings based on modality
    let simulatedFindings: any[] = [];
    if (image.modality === 'XRAY') {
      simulatedFindings.push({
        findingType: 'FRACTURE',
        confidence: parseFloat((Math.random() * 0.2 + 0.75).toFixed(2)), // 75-95%
        description: 'Possible hairline fracture detected in the distal radius.',
        boundingBox: { x: 120, y: 340, width: 45, height: 60 }
      });
    } else if (image.modality === 'CT') {
      simulatedFindings.push({
        findingType: 'NODULE',
        confidence: 0.88,
        description: '3mm pulmonary nodule in upper right lobe.',
        boundingBox: { x: 200, y: 150, width: 20, height: 20 }
      });
    }

    // Save findings
    if (simulatedFindings.length > 0) {
      await this.prisma.imageFinding.createMany({
        data: simulatedFindings.map(f => ({
          ...f,
          tenantId,
          imageId
        }))
      });
    }

    // Update status
    const processedImage = await this.prisma.medicalImage.update({
      where: { id: imageId },
      data: { status: 'COMPLETED', aiProcessedAt: new Date() },
      include: { findings: true }
    });

    this.logger.log(`AI Processing complete for image ${imageId}. Findings: ${simulatedFindings.length}`);
    return processedImage;
  }

  async uploadSimulatedImage(patientId: string, modality: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    const image = await this.prisma.medicalImage.create({
      data: {
        tenantId,
        patientId,
        modality,
        fileUrl: `https://secure-storage.medflow.internal/${tenantId}/${patientId}/${Date.now()}.dcm`,
        status: 'UPLOADED',
      }
    });

    // Auto-trigger processing async
    this.processImage(image.id).catch(err => this.logger.error('Background processing failed', err));
    return image;
  }

  async getPatientImages(patientId: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.medicalImage.findMany({
      where: { tenantId, patientId },
      include: { findings: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
