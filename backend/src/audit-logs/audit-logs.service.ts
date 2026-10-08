import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async createLog(logData: any) {
    try {
      const newLog = new this.auditLogModel(logData);
      await newLog.save();
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
    }
  }

  async getLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.auditLogModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.auditLogModel.countDocuments(),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
    };
  }

  // Cron job for auto deletion of logs after 1 day
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldLogs() {
    this.logger.log('Running daily audit log cleanup...');
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const result = await this.auditLogModel.deleteMany({
      createdAt: { $lt: oneDayAgo },
    });
    
    this.logger.log(`Deleted ${result.deletedCount} old audit logs.`);
  }
}
