import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false })
  actorId: string;

  @Prop()
  actorEmail: string;

  @Prop({ required: false, default: 'admin' })
  actorRole: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  module: string;

  @Prop()
  resourceId: string;

  @Prop()
  endpoint: string;

  @Prop({ default: 'SUCCESS' })
  status: string;

  @Prop()
  logId: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  metadata: any;

  @Prop()
  ip: string;

  @Prop()
  userAgent: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
