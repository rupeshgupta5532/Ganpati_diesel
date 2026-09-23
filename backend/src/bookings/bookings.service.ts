import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const booking = await this.bookingModel.create({
      ...createBookingDto,
      userId,
    });

    await this.notificationsService.notifyAdmin(
      'New Booking Received',
      `${createBookingDto.customerName} has requested a booking.`,
      'NEW_BOOKING',
      booking._id.toString(),
    );

    return booking;
  }

  async findAllForUser(userId: string) {
    return this.bookingModel
      .find({ userId })
      .populate('serviceId', 'name slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOneForUser(userId: string, bookingId: string) {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate('serviceId', 'name slug')
      .exec();
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId.toString() !== userId)
      throw new ForbiddenException('You do not have access to this booking');
    return booking;
  }

  async findAllAdmin() {
    return this.bookingModel
      .find()
      .populate('userId', 'name email')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOneAdmin(bookingId: string) {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name')
      .exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async updateStatusAdmin(
    bookingId: string,
    updateDto: UpdateBookingStatusDto,
  ) {
    const booking = await this.bookingModel
      .findByIdAndUpdate(
        bookingId,
        { $set: JSON.parse(JSON.stringify({ status: updateDto.status, adminNotes: updateDto.adminNotes })) },
        { new: true },
      )
      .exec();

    if (!booking) throw new NotFoundException('Booking not found');

    await this.notificationsService.notify(
      booking.userId.toString(),
      'Booking Status Updated',
      `Your booking status is now: ${updateDto.status}`,
      'BOOKING_UPDATE',
      booking._id.toString(),
    );

    return booking;
  }
}
