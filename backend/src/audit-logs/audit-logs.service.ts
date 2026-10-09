import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditLogsService implements OnModuleInit {
  constructor(
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.auditLogModel.countDocuments();
    if (count === 0) {
      await this.seedInitialLogs();
    }
  }

  private async seedInitialLogs() {
    const sampleLogs = [
      {
        logId: 'AUD-85274',
        action: 'CREATE',
        status: 'SUCCESS',
        module: 'AUTH',
        endpoint: 'POST /api/v1/auth/admin/login',
        description: 'User performed CREATE on auth',
        actorEmail: 'admin@ganpatidiesel.com',
        actorRole: 'admin',
        createdAt: new Date('2026-10-09T11:57:55'),
      },
      {
        logId: 'AUD-19084',
        action: 'CREATE',
        status: 'ERROR',
        module: 'AUTH',
        endpoint: 'POST /api/v1/auth/admin/login',
        description: 'User performed CREATE on auth',
        actorEmail: 'admin@ganpatidiesel.com',
        actorRole: 'admin',
        createdAt: new Date('2026-10-09T11:57:35'),
      },
      {
        logId: 'AUD-16704',
        action: 'UPDATE',
        status: 'SUCCESS',
        module: 'WEBSITE-CONTENT',
        endpoint: 'PATCH /api/v1/website-content',
        description: 'User performed UPDATE on website-content',
        actorEmail: 'admin@ganpatidiesel.com',
        actorRole: 'admin',
        createdAt: new Date('2026-10-08T12:40:52'),
      },
      {
        logId: 'AUD-46492',
        action: 'UPDATE',
        status: 'SUCCESS',
        module: 'ADMIN',
        endpoint: 'PATCH /api/v1/admin/reviews/:id/approve',
        description: 'User performed UPDATE on admin',
        actorEmail: 'admin@ganpatidiesel.com',
        actorRole: 'admin',
        createdAt: new Date('2026-10-08T12:33:10'),
      },
      {
        logId: 'AUD-47034',
        action: 'UPDATE',
        status: 'SUCCESS',
        module: 'ADMIN',
        endpoint: 'PATCH /api/v1/admin/reviews/:id/reject',
        description: 'User performed UPDATE on admin',
        actorEmail: 'admin@ganpatidiesel.com',
        actorRole: 'admin',
        createdAt: new Date('2026-10-08T12:33:05'),
      },
    ];
    await this.auditLogModel.insertMany(sampleLogs);
  }

  async findAll() {
    return this.auditLogModel.find().sort({ createdAt: -1 }).exec();
  }

  async createLog(logData: Partial<AuditLog>) {
    const randomId = 'AUD-' + Math.floor(10000 + Math.random() * 90000);
    const newLog = new this.auditLogModel({
      logId: logData.logId || randomId,
      ...logData,
    });
    return newLog.save();
  }
}
