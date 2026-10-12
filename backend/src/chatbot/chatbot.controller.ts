import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('ask')
  @ApiOperation({ summary: 'Ask questions to the AI assistant' })
  async ask(@Body() dto: ChatMessageDto, @Req() req: Request) {
    // Optional extraction of user from Authorization header if present
    let userId: string | undefined = undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = this.jwtService.decode(token);
        if (decoded && (decoded.userId || decoded.sub || decoded._id)) {
          userId = decoded.userId || decoded.sub || decoded._id;
        }
      } catch {
        // Continue unauthenticated if token parse fails
      }
    }

    return this.chatbotService.ask(dto.message, userId);
  }
}
