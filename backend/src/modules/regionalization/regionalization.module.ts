import { Module } from '@nestjs/common';
import { RegionalizationService } from './regionalization.service';
import { RegionalizationController } from './regionalization.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RegionalizationService],
  controllers: [RegionalizationController],
  exports: [RegionalizationService],
})
export class RegionalizationModule {}
