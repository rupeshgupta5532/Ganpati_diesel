import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WebsiteContent,
  WebsiteContentDocument,
} from './schemas/website-content.schema';
import { UpdateWebsiteContentDto } from './dto/update-content.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class WebsiteContentService {
  constructor(
    @InjectModel(WebsiteContent.name)
    private contentModel: Model<WebsiteContentDocument>,
    private readonly redisService: RedisService,
  ) {}

  async getContent(key: string = 'homepage') {
    const cached = await this.redisService.get(`cms:${key}`);
    if (cached) return JSON.parse(cached);

    const content = await this.contentModel.findOne({ key }).exec();
    if (!content) return {};

    await this.redisService.set(`cms:${key}`, JSON.stringify(content), 3600);
    return content;
  }

  async updateContent(key: string, dto: UpdateWebsiteContentDto) {
    const content = await this.contentModel
      .findOneAndUpdate({ key }, dto, { new: true, upsert: true })
      .exec();
    await this.redisService.del(`cms:${key}`);
    return content;
  }
}
