import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Fuel Injector Nozzle' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'fuel-injector-nozzle' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'BOSCH-12345' })
  @IsString()
  @IsOptional()
  partNumber?: string;

  @ApiPropertyOptional({ example: 'Injectors' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'High quality nozzle for CRDI engines.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/product.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: 4500 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
