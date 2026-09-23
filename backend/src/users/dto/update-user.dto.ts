import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe Updated' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '9800000000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Kathmandu, Nepal' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/profile.jpg' })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
