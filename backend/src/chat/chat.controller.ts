import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BranchId } from '../common/decorators/branch-id.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createMessage(
    @Body() dto: CreateMessageDto,
    @Request() req,
    @BranchId() branchId: string,
  ) {
    return this.chatService.createMessage(dto, req.user.id, branchId);
  }

  @Get()
  async getRecentMessages(@BranchId() branchId: string) {
    return this.chatService.getRecentMessages(branchId);
  }
}
