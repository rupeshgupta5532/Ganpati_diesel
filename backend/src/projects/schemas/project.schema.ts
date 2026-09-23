import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  vehicle: string;

  @Prop()
  serviceType: string;

  @Prop()
  problem: string;

  @Prop()
  solution: string;

  @Prop()
  description: string;

  @Prop()
  beforeImage: string;

  @Prop()
  afterImage: string;

  @Prop([String])
  gallery: string[];

  @Prop()
  projectDate: Date;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: true })
  isPublished: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
