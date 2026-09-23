import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateWebsiteContentDto {
  @IsOptional() @IsString() heroTitle?: string;
  @IsOptional() @IsString() heroSubtitle?: string;
  @IsOptional() @IsString() heroDescription?: string;
  @IsOptional() @IsNumber() yearsExperience?: number;
  @IsOptional() @IsNumber() projectsCompleted?: number;
  @IsOptional() @IsNumber() establishedYear?: number;
  @IsOptional() @IsString() serviceCoverage?: string;
  @IsOptional() @IsString() aboutContent?: string;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
}
