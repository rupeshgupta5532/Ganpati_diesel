import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewStatus } from './enums/review-status.enum';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { BookingStatus } from '../bookings/enums/booking-status.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const booking = await this.bookingModel.findById(createReviewDto.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId.toString() !== userId)
      throw new ForbiddenException('Cannot review a booking that is not yours');
    if (booking.status !== BookingStatus.COMPLETED)
      throw new BadRequestException('Can only review completed bookings');

    const existingReview = await this.reviewModel.findOne({
      bookingId: createReviewDto.bookingId,
    });
    if (existingReview)
      throw new ConflictException('A review for this booking already exists');

    return this.reviewModel.create({
      ...createReviewDto,
      userId,
      status: ReviewStatus.PENDING,
    });
  }

  async findAllPublic() {
    return this.reviewModel
      .find({ status: ReviewStatus.APPROVED })
      .populate('userId', 'name profileImage')
      .populate({
        path: 'bookingId',
        populate: { path: 'serviceId', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllAdmin() {
    return this.reviewModel
      .find()
      .populate('userId', 'name email')
      .populate({
        path: 'bookingId',
        populate: { path: 'serviceId', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(id: string, status: ReviewStatus) {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async remove(id: string) {
    const deleted = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Review not found');
    return { success: true, message: 'Review deleted' };
  }
}
