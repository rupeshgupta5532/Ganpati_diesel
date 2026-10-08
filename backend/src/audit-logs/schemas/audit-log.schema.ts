import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop() logId: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false }) userId: string;
  @Prop({ required: false }) userEmail: string;
  @Prop({ required: false }) userRole: string;
  @Prop({ required: true }) action: string;
  @Prop({ required: true }) resource: string;
  @Prop() resourceId: string;
  @Prop() description: string;
  @Prop({ required: true }) status: string;
  @Prop() errorMessage: string;
    @Prop() method: string;
  @Prop() endpoint: string;
    @Prop() userAgent: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
