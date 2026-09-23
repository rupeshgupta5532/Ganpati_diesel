import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Get application health status' })
  check() {
    return {
      status: 'ok',
      database: 'pending',
      redis: 'pending',
      timestamp: new Date().toISOString(),
    };
  }
}
