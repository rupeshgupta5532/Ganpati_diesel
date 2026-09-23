import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { UpdateContactDto } from './dto/update-contact.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private readonly redisService: RedisService,
  ) {}

  async getContact() {
    const cached = await this.redisService.get('cms:contact');
    if (cached) return JSON.parse(cached);

    const contact = await this.contactModel.findOne({ key: 'main' }).exec();
    if (!contact) return {};

    await this.redisService.set('cms:contact', JSON.stringify(contact), 3600);
    return contact;
  }

  async updateContact(dto: UpdateContactDto) {
    const contact = await this.contactModel
      .findOneAndUpdate({ key: 'main' }, dto, { new: true, upsert: true })
      .exec();
    await this.redisService.del('cms:contact');
    return contact;
  }
}
