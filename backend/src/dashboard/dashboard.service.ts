import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { Enquiry, EnquiryDocument } from '../enquiries/schemas/enquiry.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';
import { RedisService } from '../redis/redis.service';
import { Role } from '../common/enums/role.enum';
import { BookingStatus } from '../bookings/enums/booking-status.enum';
import { EnquiryStatus } from '../enquiries/enums/enquiry-status.enum';
import { ReviewStatus } from '../reviews/enums/review-status.enum';

@Injectable()
export class DashboardService {
  private readonly CACHE_KEY = 'dashboard:admin:summary';

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly redisService: RedisService,
  ) {}

  async getSummary() {
    const cached = await this.redisService.get(this.CACHE_KEY);
    if (cached) return JSON.parse(cached);

    const [
      totalUsers,
      totalBookings,
      pendingBookings,
      totalEnquiries,
      newEnquiries,
      pendingReviews,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: Role.USER }),
      this.bookingModel.countDocuments(),
      this.bookingModel.countDocuments({ status: BookingStatus.PENDING }),
      this.enquiryModel.countDocuments(),
      this.enquiryModel.countDocuments({ status: EnquiryStatus.NEW }),
      this.reviewModel.countDocuments({ status: ReviewStatus.PENDING }),
    ]);

    const summary = {
      users: { total: totalUsers },
      bookings: { total: totalBookings, pending: pendingBookings },
      enquiries: { total: totalEnquiries, new: newEnquiries },
      reviews: { pending: pendingReviews },
    };

    // Cache the summary for 5 minutes
    await this.redisService.set(this.CACHE_KEY, JSON.stringify(summary), 300);

    return summary;
  }
}
