import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user/admin' })
  findAll(@CurrentUser() user: any) {
    // If admin, they query admin notifications (where userId is undefined) or we pass their ID.
    // Simplifying: we'll just query by their userId. (Admins might not have a userId on the notification, wait.)
    // If admin, we should fetch notifications without a userId.
    const queryId =
      user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
        ? undefined
        : user.userId;
    return this.notificationsService.findAllForUser(queryId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@CurrentUser() user: any) {
    const queryId =
      user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
        ? undefined
        : user.userId;
    return this.notificationsService.findUnreadCount(queryId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser() user: any) {
    const queryId =
      user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
        ? undefined
        : user.userId;
    return this.notificationsService.markAllAsRead(queryId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    const queryId =
      user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
        ? undefined
        : user.userId;
    return this.notificationsService.markAsRead(id, queryId);
  }
}
