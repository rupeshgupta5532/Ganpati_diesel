import { IsString, IsOptional, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Complete Overhaul of CRDI System' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'complete-overhaul-crdi' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Mahindra Scorpio' })
  @IsString()
  @IsOptional()
  vehicle?: string;

  @ApiPropertyOptional({ example: 'CRDI Repair' })
  @IsString()
  @IsOptional()
  serviceType?: string;

  @ApiPropertyOptional({ example: 'Severe knocking and black smoke.' })
  @IsString()
  @IsOptional()
  problem?: string;

  @ApiPropertyOptional({ example: 'Replaced nozzles and calibrated pump.' })
  @IsString()
  @IsOptional()
  solution?: string;

  @ApiPropertyOptional({ example: 'Detailed case study text...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/before.jpg' })
  @IsString()
  @IsOptional()
  beforeImage?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/after.jpg' })
  @IsString()
  @IsOptional()
  afterImage?: string;

  @ApiPropertyOptional({ example: ['https://cloudinary.com/gallery1.jpg'] })
  @IsArray()
  @IsOptional()
  gallery?: string[];

  @ApiPropertyOptional({ example: '2026-09-22T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  projectDate?: Date;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
