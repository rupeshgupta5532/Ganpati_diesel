import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Enquiry, EnquirySchema } from '../enquiries/schemas/enquiry.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Enquiry.name, schema: EnquirySchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
