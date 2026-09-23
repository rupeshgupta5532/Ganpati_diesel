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
}
