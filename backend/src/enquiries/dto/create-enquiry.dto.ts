import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnquiryDto {
  @ApiProperty({ example: 'Sita Sharma' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'sita@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '9800000001' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Quotation for bulk injector repair' })
  @IsString()
  subject: string;

  @ApiPropertyOptional({ example: 'Injector Service' })
  @IsString()
  @IsOptional()
  service?: string;

  @ApiProperty({ example: 'I have 10 injectors that need servicing. What is the cost?' })
  @IsString()
  message: string;
}
