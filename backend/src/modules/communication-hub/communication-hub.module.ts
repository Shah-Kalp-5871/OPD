import { Module } from '@nestjs/common';
import { CommunicationHubService } from './communication-hub.service';
import { CommunicationHubController } from './communication-hub.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommunicationHubService],
  controllers: [CommunicationHubController],
  exports: [CommunicationHubService],
})
export class CommunicationHubModule {}
