import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
@Processor('tenant-onboarding')
export class TenantOnboardingProcessor extends WorkerHost {
  private readonly logger = new Logger('TenantOnboardingProcessor');

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { tenantId, name, slug, adminEmail, adminUserId, adminName } = job.data;
    this.logger.log(`Starting workspace provisioning job ${job.id} for tenant: ${name} (${slug})`);

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Double check if default Clinic exists for this tenant
      let clinic = await tx.clinic.findFirst({
        where: { tenantId },
      });

      if (!clinic) {
        this.logger.log(`Provisioning default clinic for tenant ID: ${tenantId}`);
        clinic = await tx.clinic.create({
          data: {
            name: `${name} General Hospital`,
            email: adminEmail,
            isActive: true,
            tenantId,
          },
        });
      }

      // 2. Double check if default Branch exists
      let branch = await tx.branch.findFirst({
        where: { clinicId: clinic.id },
      });

      if (!branch) {
        this.logger.log(`Provisioning default branch for clinic: ${clinic.name}`);
        const branchCode = `BR-${slug.toUpperCase()}-01`;
        
        branch = await tx.branch.create({
          data: {
            clinicId: clinic.id,
            name: 'Main HQ Branch',
            branchCode,
            isActive: true,
            timezone: 'UTC',
          },
        });
      }

      // 3. Establish primary administrator link
      if (adminUserId) {
        const existingTenantUser = await tx.tenantUser.findUnique({
          where: {
            tenantId_userId: {
              tenantId,
              userId: adminUserId,
            },
          },
        });

        if (!existingTenantUser) {
          this.logger.log(`Assigning userId: ${adminUserId} as SUPER_ADMIN of tenant: ${tenantId}`);
          await tx.tenantUser.create({
            data: {
              tenantId,
              userId: adminUserId,
              role: 'SUPER_ADMIN',
            },
          });
        }
      }

      return {
        clinicId: clinic.id,
        branchId: branch.id,
      };
    });

    this.logger.log(`Provisioning completed successfully for tenant: ${slug}`);
    return result;
  }
}
