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

  private getQuery(userId?: string, extra: Record<string, any> = {}) {
    if (userId) {
      return { userId, ...extra };
    }
    return {
      $or: [{ userId: { $exists: false } }, { userId: null }],
      ...extra,
    };
  }

  async findAllForUser(userId?: string) {
    return this.notificationModel
      .find(this.getQuery(userId))
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnreadCount(userId?: string) {
    return this.notificationModel
      .countDocuments(this.getQuery(userId, { isRead: false }))
      .exec();
  }

  async markAsRead(id: string, userId?: string) {
    const query = userId ? { _id: id, userId } : { _id: id };
    const notification = await this.notificationModel
      .findOneAndUpdate(query, { isRead: true }, { new: true })
      .exec();

    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async markAllAsRead(userId?: string) {
    await this.notificationModel
      .updateMany(this.getQuery(userId, { isRead: false }), { isRead: true })
      .exec();
    return { success: true, message: 'All notifications marked as read' };
  }

  async remove(id: string, userId?: string) {
    const query = userId ? { _id: id, userId } : { _id: id };
    const notification = await this.notificationModel
      .findOneAndDelete(query)
      .exec();

    if (!notification) throw new NotFoundException('Notification not found');
    return { success: true, message: 'Notification deleted' };
  }

  async removeAll(userId?: string) {
    await this.notificationModel
      .deleteMany(this.getQuery(userId))
      .exec();
    return { success: true, message: 'All notifications deleted' };
  }
}