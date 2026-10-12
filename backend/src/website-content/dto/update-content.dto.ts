import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWebsiteContentDto {
  @IsOptional() @IsString() heroTitle?: string;
  @IsOptional() @IsString() heroSubtitle?: string;
  @IsOptional() @IsString() heroDescription?: string;
  @IsOptional() @Type(() => Number) @IsNumber() yearsExperience?: number;
  @IsOptional() @Type(() => Number) @IsNumber() projectsCompleted?: number;
  @IsOptional() @Type(() => Number) @IsNumber() establishedYear?: number;
  @IsOptional() @IsString() serviceCoverage?: string;
  @IsOptional() @IsString() aboutContent?: string;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
}
