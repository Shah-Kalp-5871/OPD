import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createMessage(
    @Body() dto: CreateMessageDto,
    @Request() req,
  ) {
    return this.chatService.createMessage(dto, req.user.id, req.user.tenantId);
  }

  @Get()
  async getRecentMessages(@Request() req) {
    return this.chatService.getRecentMessages(req.user.tenantId);
  }
}
