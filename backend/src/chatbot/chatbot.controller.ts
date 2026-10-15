import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a diagnostic query to Ganpati AI Assistant' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Why is my engine producing black smoke?' },
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', example: 'user' },
              text: { type: 'string', example: 'Hello' },
            },
          },
        },
      },
      required: ['message'],
    },
  })
  async sendMessage(
    @Body('message') message: string,
    @Body('history') history?: Array<{ role: string; text: string }>,
  ) {
    if (!message || typeof message !== 'string') {
      return {
        success: false,
        reply: 'Please provide a valid question or symptom description.',
      };
    }

    return this.chatbotService.generateResponse(message, history || []);
  }
}
