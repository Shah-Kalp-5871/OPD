import { Module, Global } from '@nestjs/common';
import { SmsWhatsappService } from './sms-whatsapp.service';
import { EmailService } from './email.service';
import { CommunicationsController } from './communications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';

@Global()
@Module({
  imports: [PrismaModule, CommonModule],
  providers: [SmsWhatsappService, EmailService],
  controllers: [CommunicationsController],
  exports: [SmsWhatsappService, EmailService],
})
export class CommunicationsModule {}
