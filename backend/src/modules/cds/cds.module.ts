import { Module } from '@nestjs/common';
import { CdsService } from './cds.service';
import { CdsController } from './cds.controller';

@Module({
  providers: [CdsService],
  controllers: [CdsController]
})
export class CdsModule {}
