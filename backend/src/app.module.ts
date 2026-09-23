import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { ProductsModule } from './products/products.module';
import { BookingsModule } from './bookings/bookings.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProjectsModule } from './projects/projects.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WebsiteContentModule } from './website-content/website-content.module';
import { ContactModule } from './contact/contact.module';
import { UploadsModule } from './uploads/uploads.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    ProductsModule,
    BookingsModule,
    EnquiriesModule,
    NotificationsModule,
    ProjectsModule,
    ReviewsModule,
    DashboardModule,
    WebsiteContentModule,
    ContactModule,
    UploadsModule,
    AuditLogsModule,
  ],
})
export class AppModule {}
