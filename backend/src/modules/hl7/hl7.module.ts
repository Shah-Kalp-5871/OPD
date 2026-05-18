import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../prisma/prisma.module';
import { Hl7Controller } from './hl7.controller';
import { Hl7Service } from './hl7.service';
import { Hl7Processor } from './processors/hl7.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue(
      { name: 'hl7-ingestion' },
      { name: 'hl7-processing' },
      { name: 'hl7-dead-letter' },
    ),
  ],
  controllers: [Hl7Controller],
  providers: [
    Hl7Service,
    Hl7Processor,
  ],
  exports: [Hl7Service],
})
export class Hl7Module {}
