import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: String, enum: Role, default: Role.ADMIN })
  role: Role;

  @Prop()
  profileImage: string;

  @Prop()
  refreshTokenHash: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
