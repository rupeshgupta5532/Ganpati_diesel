import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateContactDto {
  @IsOptional() @IsString() primaryPhone?: string;
  @IsOptional() @IsString() secondaryPhone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() googleMapsUrl?: string;
  @IsOptional() @IsString() openingHours?: string;
  @IsOptional() @IsObject() socialLinks?: any;

  // Metadata properties allowed to prevent 400 Bad Request if clients pass full document
  @IsOptional() _id?: any;
  @IsOptional() key?: any;
  @IsOptional() createdAt?: any;
  @IsOptional() updatedAt?: any;
  @IsOptional() __v?: any;
}

