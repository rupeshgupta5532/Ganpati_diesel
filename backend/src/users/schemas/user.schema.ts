import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  passwordHash?: string;


  @Prop({ unique: true, sparse: true })
  googleId?: string;

  @Prop({ unique: true, sparse: true })
  githubId?: string;

  @Prop({
    enum: ['local', 'google', 'github'],
    default: 'local',
  })
  authProvider: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop()
  profileImage: string;

  @Prop()
  address: string;

  @Prop()
  refreshTokenHash: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  resetPasswordOtp: string;

  @Prop()
  resetPasswordExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
