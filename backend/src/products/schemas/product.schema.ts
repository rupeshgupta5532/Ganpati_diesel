import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  partNumber: string;

  @Prop()
  category: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: true })
  availability: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
