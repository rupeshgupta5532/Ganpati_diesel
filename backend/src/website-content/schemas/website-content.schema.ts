import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebsiteContentDocument = WebsiteContent & Document;

@Schema({ timestamps: true })
export class WebsiteContent {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop() heroTitle: string;
  @Prop() heroSubtitle: string;
  @Prop() heroDescription: string;
  @Prop() yearsExperience: number;
  @Prop() projectsCompleted: number;
  @Prop() establishedYear: number;
  @Prop() serviceCoverage: string;
  @Prop() aboutContent: string;
  @Prop() seoTitle: string;
  @Prop() seoDescription: string;
}

export const WebsiteContentSchema =
  SchemaFactory.createForClass(WebsiteContent);
