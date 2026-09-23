import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'High Pressure Pump Repair' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'high-pressure-pump-repair' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Expert repair for high-pressure diesel pumps.' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Detailed description of the service...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/image.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: ['Calibration', 'Cleaning', 'Testing'] })
  @IsArray()
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}
