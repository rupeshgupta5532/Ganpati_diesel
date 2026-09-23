import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly redisService: RedisService,
  ) {}

  async notify(
    userId: string,
    title: string,
    message: string,
    type: string,
    referenceId?: string,
  ) {
    const notification = await this.notificationModel.create({
      userId,
      title,
      message,
      type,
      referenceId,
    });

    // Publish to Redis to be caught by WebSocket Gateway
    try {
      this.redisService.publish('notifications', JSON.stringify({ room: `user:${userId}`, data: notification }));
    } catch(e) { this.logger.warn('Failed to publish notification to redis'); }
  }

  async notifyAdmin(
    title: string,
    message: string,
    type: string,
    referenceId?: string,
  ) {
    const notification = await this.notificationModel.create({
      title,
      message,
      type,
      referenceId,
    });

    try {
      this.redisService.publish('notifications', JSON.stringify({ room: 'admin-room', data: notification }));
    } catch(e) { this.logger.warn('Failed to publish admin notification to redis'); }
  }

  async findAllForUser(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnreadCount(userId: string) {
    return this.notificationModel
      .countDocuments({ userId, isRead: false })
      .exec();
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationModel
      .findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true })
      .exec();

    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel
      .updateMany({ userId, isRead: false }, { isRead: true })
      .exec();
    return { success: true, message: 'All notifications marked as read' };
  }
}
