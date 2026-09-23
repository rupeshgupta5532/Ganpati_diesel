import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import {
  BookingsController,
  AdminBookingsController,
} from './bookings.controller';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    NotificationsModule,
  ],
  controllers: [BookingsController, AdminBookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
