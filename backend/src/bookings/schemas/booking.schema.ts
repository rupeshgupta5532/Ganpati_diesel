import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BookingStatus } from '../enums/booking-status.enum';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop()
  customerName: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  vehicleType: string;

  @Prop()
  vehicleModel: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service' })
  serviceId: string;

  @Prop()
  problemDescription: string;

  @Prop()
  preferredDate: Date;

  @Prop()
  preferredTime: string;

  @Prop()
  message: string;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop()
  adminNotes: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
