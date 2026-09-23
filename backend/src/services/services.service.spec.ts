import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { getModelToken } from '@nestjs/mongoose';
import { Service } from './schemas/service.schema';
import { RedisService } from '../redis/redis.service';

describe('ServicesService', () => {
  let service: ServicesService;

  const mockServiceModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: getModelToken(Service.name), useValue: mockServiceModel },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
