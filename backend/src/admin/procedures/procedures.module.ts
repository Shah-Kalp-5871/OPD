import { Module } from '@nestjs/common';
import { ProcedureMasterController } from './procedures.controller';
import { ProcedureMasterService } from './procedures.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProcedureMasterController],
  providers: [ProcedureMasterService],
  exports: [ProcedureMasterService],
})
export class ProcedureMasterModule {}
