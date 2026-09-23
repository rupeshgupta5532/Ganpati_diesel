import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true, unique: true }) key: string;
  @Prop() primaryPhone: string;
  @Prop() secondaryPhone: string;
  @Prop() whatsapp: string;
  @Prop() email: string;
  @Prop() address: string;
  @Prop() googleMapsUrl: string;
  @Prop() openingHours: string;
  @Prop({ type: Object }) socialLinks: any;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
