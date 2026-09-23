import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  actorId: string;
  @Prop({ required: true }) actorRole: string;
  @Prop({ required: true }) action: string;
  @Prop({ required: true }) module: string;
  @Prop() resourceId: string;
  @Prop({ type: Object }) metadata: any;
  @Prop() ip: string;
  @Prop() userAgent: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
