import { Module } from '@nestjs/common';
import { BiomedicalService } from './biomedical.service';
import { BiomedicalController } from './biomedical.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, TenancyModule],
  controllers: [BiomedicalController],
  providers: [BiomedicalService],
  exports: [BiomedicalService],
})
export class BiomedicalModule {}
