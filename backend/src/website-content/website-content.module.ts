import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsiteContentService } from './website-content.service';
import { WebsiteContentController } from './website-content.controller';
import {
  WebsiteContent,
  WebsiteContentSchema,
} from './schemas/website-content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebsiteContent.name, schema: WebsiteContentSchema },
    ]),
  ],
  controllers: [WebsiteContentController],
  providers: [WebsiteContentService],
})
export class WebsiteContentModule {}
