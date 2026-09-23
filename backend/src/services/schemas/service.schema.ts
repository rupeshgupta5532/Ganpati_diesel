import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  shortDescription: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop([String])
  features: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  displayOrder: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
