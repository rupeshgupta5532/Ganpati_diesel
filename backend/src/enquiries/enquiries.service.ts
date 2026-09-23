import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enquiry, EnquiryDocument } from './schemas/enquiry.schema';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto, userId?: string) {
    try {
      const enquiry = await this.enquiryModel.create({
        ...createEnquiryDto,
        userId,
      });

      try {
        await this.notificationsService.notifyAdmin(
          'New Enquiry Received',
          `New enquiry from ${createEnquiryDto.name}`,
          'NEW_ENQUIRY',
          enquiry._id.toString(),
        );
      } catch (notifyErr) {
        console.warn('Failed to send notification', notifyErr.message);
      }

      return enquiry;
    } catch (err) {
      console.error('Failed to create enquiry in DB:', err);
      throw err;
    }
  }

  async findAllForUser(userId: string) {
    return this.enquiryModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findAllAdmin() {
    return this.enquiryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOneAdmin(id: string) {
    const enquiry = await this.enquiryModel.findById(id).exec();
    if (!enquiry) throw new NotFoundException('Enquiry not found');
    return enquiry;
  }

  async updateAdmin(id: string, updateDto: UpdateEnquiryDto) {
    const enquiry = await this.enquiryModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!enquiry) throw new NotFoundException('Enquiry not found');

    // Notify user if status changed and user is registered
    if (updateDto.status && enquiry.userId) {
      await this.notificationsService.notify(
        enquiry.userId.toString(),
        'Enquiry Status Updated',
        `Your enquiry status is now: ${updateDto.status}`,
        'ENQUIRY_UPDATE',
        enquiry._id.toString(),
      );
    }

    return enquiry;
  }

  async removeAdmin(id: string) {
    const enquiry = await this.enquiryModel.findByIdAndDelete(id).exec();
    if (!enquiry) throw new NotFoundException('Enquiry not found');
    return { success: true, message: 'Enquiry deleted' };
  }
}
