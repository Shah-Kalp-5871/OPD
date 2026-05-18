import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

@Injectable()
export class PrescriptionSignatureService {
  private readonly signingSecret: string;

  constructor(private readonly prisma: PrismaService) {
    this.signingSecret = process.env.PRESCRIPTION_SIGNING_SECRET || 'MEDFLOW_EMR_SECURE_COMPLIANCE_SIGNING_SECRET_2026';
  }

  /**
   * Generates a unique SHA-256 hash of a prescription details
   */
  calculatePrescriptionHash(prescription: any): string {
    const patientName = `${prescription.patientCase?.patient?.firstName || ''} ${prescription.patientCase?.patient?.lastName || ''}`;
    const patientMrd = prescription.patientCase?.patient?.mrdNumber || '';
    const doctorId = prescription.doctorId;
    
    // Sort items to maintain order stability
    const sortedItems = [...(prescription.items || [])].sort((a, b) => a.id.localeCompare(b.id));
    const itemsString = sortedItems
      .map((it) => `${it.drugName}:${it.dosage}:${it.frequency}:${it.duration}:${it.instructions || ''}`)
      .join('|');

    const rawPayload = [
      prescription.id,
      patientName,
      patientMrd,
      doctorId,
      prescription.branchId,
      itemsString,
      prescription.createdAt.toISOString(),
    ].join('::');

    return crypto.createHash('sha256').update(rawPayload).digest('hex');
  }

  /**
   * Creates a digital signature of the hash
   */
  signHash(hash: string): string {
    return crypto.createHmac('sha256', this.signingSecret).update(hash).digest('hex');
  }

  /**
   * Performs digital signing of a prescription
   */
  async signPrescription(prescriptionId: string, actorId: string): Promise<any> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        items: true,
        patientCase: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription ${prescriptionId} not found`);
    }

    if (prescription.signedHash) {
      throw new BadRequestException(`Prescription ${prescriptionId} is already digitally signed`);
    }

    const hash = this.calculatePrescriptionHash(prescription);
    const signature = this.signHash(hash);

    const updated = await this.prisma.prescription.update({
      where: { id: prescriptionId },
      data: {
        signedHash: signature,
        signedAt: new Date(),
        signedBy: actorId,
        verificationStatus: 'SIGNED',
      },
      include: {
        items: true,
        patientCase: {
          include: {
            patient: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Verify integrity of a prescription
   */
  async verifyPrescription(prescriptionId: string): Promise<any> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        items: true,
        patientCase: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!prescription) {
      return {
        verified: false,
        status: 'NOT_FOUND',
        message: 'Prescription record does not exist on the server',
      };
    }

    if (!prescription.signedHash) {
      return {
        verified: false,
        status: 'UNSIGNED',
        message: 'Prescription has not been digitally signed',
        prescriptionId: prescription.id,
      };
    }

    // Re-calculate the expected hash
    const currentHash = this.calculatePrescriptionHash(prescription);
    const expectedSignature = this.signHash(currentHash);

    // Verify signature integrity
    const isIntegrityMatch = prescription.signedHash === expectedSignature;

    // Fetch signing doctor info
    const doctor = await this.prisma.user.findUnique({
      where: { id: prescription.signedBy || prescription.doctorId },
      select: { id: true, name: true, role: true, email: true },
    });

    return {
      verified: isIntegrityMatch,
      status: isIntegrityMatch ? 'VERIFIED' : 'TAMPERED',
      message: isIntegrityMatch
        ? 'Digital signature is valid and prescription has not been modified since signing.'
        : 'CRITICAL WARNING: Prescription details do not match original signature. Tampering or corruption detected.',
      prescriptionId: prescription.id,
      signedAt: prescription.signedAt,
      signedBy: doctor || { id: prescription.signedBy, name: 'Unknown Practitioner' },
      hash: currentHash,
      storedHash: prescription.signedHash,
    };
  }

  /**
   * Generates verification QR payload and URL
   */
  async generateVerificationQR(prescriptionId: string): Promise<string> {
    const verificationUrl = `https://medflow.example.com/api/prescription-signature/verify/${prescriptionId}`;
    return QRCode.toDataURL(verificationUrl);
  }

  /**
   * Generates a beautiful tamper-proof signed PDF document
   */
  async generateSignedPDF(prescriptionId: string): Promise<Buffer> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        items: true,
        patientCase: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription ${prescriptionId} not found`);
    }

    const doctor = await this.prisma.user.findUnique({
      where: { id: prescription.signedBy || prescription.doctorId },
    });

    // Ensure prescription is signed (auto-sign if not yet signed to remain seamless)
    let signedPrescription = prescription;
    if (!prescription.signedHash) {
      signedPrescription = await this.signPrescription(prescriptionId, doctor?.id || prescription.doctorId);
    }

    const qrDataUrl = await this.generateVerificationQR(prescriptionId);
    // Strip data url prefix to get raw base64 buffer for PDF embed
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(base64Data, 'base64');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (err) => reject(err));

      // --- HEADER SECTION ---
      doc.fillColor('#1a365d').fontSize(24).font('Helvetica-Bold').text('MEDFLOW HEALTHCARE NETWORK', { align: 'center' });
      doc.fontSize(10).font('Helvetica').fillColor('#4a5568').text('DIGITALLY SIGNED SECURE CLINICAL PRESCRIPTION', { align: 'center' });
      doc.moveDown();

      // Divider Line
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown();

      // --- PATIENT & DOC INFO GRID ---
      const startY = doc.y;
      doc.fillColor('#2d3748');

      // Left Column
      doc.fontSize(11).font('Helvetica-Bold').text('PATIENT PROFILE', 50, startY);
      doc.font('Helvetica').fontSize(10);
      doc.text(`Name: ${signedPrescription.patientCase?.patient?.firstName || ''} ${signedPrescription.patientCase?.patient?.lastName || ''}`);
      doc.text(`MRD Number: ${signedPrescription.patientCase?.patient?.mrdNumber || 'N/A'}`);
      doc.text(`Gender: ${signedPrescription.patientCase?.patient?.gender || 'N/A'}`);
      doc.text(`Case ID: ${signedPrescription.caseId}`);

      // Right Column
      doc.fontSize(11).font('Helvetica-Bold').text('CLINICAL PROVIDER', 320, startY);
      doc.font('Helvetica').fontSize(10);
      doc.text(`Prescribing Doctor: Dr. ${doctor?.name || 'Practitioner'}`);
      doc.text(`Email: ${doctor?.email || 'N/A'}`);
      doc.text(`Branch: ${signedPrescription.branchId}`);
      doc.text(`Date Issued: ${signedPrescription.createdAt.toLocaleDateString()}`);

      doc.moveDown(2.5);

      // --- WATERMARK BACKGROUND ---
      // Save state, set high transparency, write watermark diagonally, restore state
      doc.save();
      doc.fillColor('#e2e8f0');
      doc.fillOpacity(0.12);
      doc.fontSize(32);
      doc.rotate(-30, { origin: [300, 400] });
      doc.text('MEDFLOW OFFICIAL E-PRESCRIPTION', 100, 380, { align: 'center' });
      doc.rotate(30, { origin: [300, 400] });
      doc.restore();

      // --- MEDICATION LIST ---
      doc.fillColor('#1a365d').fontSize(12).font('Helvetica-Bold').text('MEDICATION ORDERS & RX', 50, doc.y);
      doc.moveDown(0.5);

      // Table Header
      const tableTop = doc.y;
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, tableTop).lineTo(545, tableTop).stroke();
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568');
      doc.text('Drug Name', 55, tableTop + 5, { width: 180 });
      doc.text('Dosage', 240, tableTop + 5, { width: 80 });
      doc.text('Frequency', 330, tableTop + 5, { width: 90 });
      doc.text('Duration', 430, tableTop + 5, { width: 60 });
      doc.text('Disp.', 500, tableTop + 5, { width: 40 });

      doc.strokeColor('#e2e8f0').moveTo(50, tableTop + 20).lineTo(545, tableTop + 20).stroke();

      let itemY = tableTop + 25;
      doc.font('Helvetica').fillColor('#2d3748');
      
      (signedPrescription.items || []).forEach((item) => {
        // Prevent overflow
        if (itemY > 650) {
          doc.addPage();
          itemY = 50;
        }

        doc.text(item.drugName, 55, itemY, { width: 180 });
        doc.text(item.dosage, 240, itemY, { width: 80 });
        doc.text(item.frequency, 330, itemY, { width: 90 });
        doc.text(`${item.duration} Days`, 430, itemY, { width: 60 });
        doc.text(item.isDispensed ? 'Yes' : 'No', 500, itemY, { width: 40 });

        if (item.instructions) {
          itemY += 15;
          doc.fontSize(8.5).font('Helvetica-Oblique').fillColor('#718096').text(`Instructions: ${item.instructions}`, 65, itemY, { width: 450 });
          doc.fontSize(10).font('Helvetica').fillColor('#2d3748');
        }

        itemY += 20;
        doc.strokeColor('#f7fafc').moveTo(50, itemY - 5).lineTo(545, itemY - 5).stroke();
      });

      doc.moveDown(3);

      // --- SIGNATURE AREA & QR CODE VERIFICATION ---
      const sigY = 650;
      doc.strokeColor('#cbd5e0').lineWidth(0.5).moveTo(50, sigY).lineTo(545, sigY).stroke();

      // Embed Verification QR Code
      doc.image(qrBuffer, 50, sigY + 10, { width: 80 });

      // Verification Metadata
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#718096');
      doc.text('CRYPTOGRAPHIC SECURITY SUMMARY', 140, sigY + 12);
      doc.font('Helvetica').fontSize(7.5);
      doc.text(`Digital Hash: ${signedPrescription.signedHash?.substring(0, 32)}...`);
      doc.text(`Signed At: ${signedPrescription.signedAt?.toISOString()}`);
      doc.text(`Signed By: Dr. ${doctor?.name || 'Clinical Practitioner'} (ID: ${signedPrescription.signedBy})`);
      doc.text(`Verification Authority: MedFlow Compliance Framework (HMAC-SHA256)`);
      doc.fillColor('#3182ce').text('Scan QR to verify prescription authenticity & clinical status dynamically.', 140, sigY + 52);

      // Seal & Signature Area
      doc.strokeColor('#1a365d').lineWidth(1.5);
      doc.rect(380, sigY + 10, 160, 75).stroke();
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#1a365d').text('ELECTRONIC SIGNATURE SEAL', 385, sigY + 15, { align: 'center', width: 150 });
      doc.font('Helvetica').fontSize(8).fillColor('#2d3748').text(`Dr. ${doctor?.name || 'Practitioner'}`, 385, sigY + 32, { align: 'center', width: 150 });
      doc.text('MedFlow Network Verified', 385, sigY + 45, { align: 'center', width: 150 });
      doc.fillColor('#e53e3e').fontSize(7.5).text('TAMPER-PROTECTED ACTIVE RX', 385, sigY + 68, { align: 'center', width: 150 });

      // End PDF Document
      doc.end();
    });
  }
}
