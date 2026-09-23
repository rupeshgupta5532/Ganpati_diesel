import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesService } from './services.service';
import {
  ServicesController,
  AdminServicesController,
} from './services.controller';
import { Service, ServiceSchema } from './schemas/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
  ],
  controllers: [ServicesController, AdminServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
