import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Contact, ContactSchema } from '../contact/schemas/contact.schema';
import { WebsiteContent, WebsiteContentSchema } from '../website-content/schemas/website-content.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Contact.name, schema: ContactSchema },
      { name: WebsiteContent.name, schema: WebsiteContentSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
