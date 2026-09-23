import { IsString, IsEmail, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Ram Kumar' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: '9800000000' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'ram@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Truck' })
  @IsString()
  vehicleType: string;

  @ApiProperty({ example: 'Tata 1512' })
  @IsString()
  vehicleModel: string;

  @ApiPropertyOptional({ example: '64a1b2c3d4e5f6g7h8i9j0k1', description: 'MongoDB ObjectId of the Service' })
  @IsMongoId()
  @IsOptional()
  serviceId?: string;

  @ApiProperty({ example: 'Engine is vibrating abnormally and losing power.' })
  @IsString()
  problemDescription: string;

  @ApiProperty({ example: '2026-10-15T10:00:00.000Z' })
  @IsString()
  preferredDate: string;

  @ApiPropertyOptional({ example: 'Please arrange for morning checkup.' })
  @IsString()
  @IsOptional()
  message?: string;
}
