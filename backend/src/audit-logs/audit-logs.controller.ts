import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Audit Logs')
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@ApiBearerAuth()
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs (Admin only)' })
  getLogs(@Query('page') page: number, @Query('limit') limit: number) {
    return this.auditLogsService.getLogs(Number(page) || 1, Number(limit) || 50);
  }
}
