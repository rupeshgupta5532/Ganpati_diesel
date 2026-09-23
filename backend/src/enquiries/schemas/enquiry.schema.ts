import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EnquiryStatus } from '../enums/enquiry-status.enum';

export type EnquiryDocument = Enquiry & Document;

@Schema({ timestamps: true })
export class Enquiry {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  subject: string;

  @Prop()
  service: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: String, enum: EnquiryStatus, default: EnquiryStatus.NEW })
  status: EnquiryStatus;

  @Prop()
  adminNotes: string;
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);
