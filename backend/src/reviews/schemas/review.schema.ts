import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ReviewStatus } from '../enums/review-status.enum';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking', required: true })
  bookingId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ type: String, enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
