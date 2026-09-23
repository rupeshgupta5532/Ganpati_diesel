import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnquiriesService } from './enquiries.service';
import {
  EnquiriesController,
  AdminEnquiriesController,
} from './enquiries.controller';
import { Enquiry, EnquirySchema } from './schemas/enquiry.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enquiry.name, schema: EnquirySchema }]),
    NotificationsModule,
  ],
  controllers: [EnquiriesController, AdminEnquiriesController],
  providers: [EnquiriesService],
  exports: [EnquiriesService],
})
export class EnquiriesModule {}
