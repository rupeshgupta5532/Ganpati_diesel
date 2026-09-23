import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ServicesService {
  private readonly CACHE_KEY = 'services:list:active';

  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    private readonly redisService: RedisService,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const existing = await this.serviceModel.findOne({
      slug: createServiceDto.slug,
    });
    if (existing)
      throw new ConflictException('Service with this slug already exists');

    const newService = await this.serviceModel.create(createServiceDto);
    await this.redisService.del(this.CACHE_KEY);
    return newService;
  }

  async findAllPublic() {
    const cached = await this.redisService.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    const services = await this.serviceModel
      .find({ isActive: true })
      .sort({ displayOrder: 1 })
      .exec();

    await this.redisService.set(this.CACHE_KEY, JSON.stringify(services), 3600); // 1 hr cache
    return services;
  }

  async findAllAdmin() {
    return this.serviceModel.find().sort({ displayOrder: 1 }).exec();
  }

  async findOneBySlug(slug: string) {
    const service = await this.serviceModel
      .findOne({ slug, isActive: true })
      .exec();
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const updated = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Service not found');

    await this.redisService.del(this.CACHE_KEY);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Service not found');

    await this.redisService.del(this.CACHE_KEY);
    return { success: true, message: 'Service deleted' };
  }
}
