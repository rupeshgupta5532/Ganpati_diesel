import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminSignupDto {
  @ApiProperty({ example: 'Super Admin', description: 'The name of the admin' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@ganpatidiesel.com', description: 'Admin email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Strong password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'default-admin-key', description: 'Server registration key' })
  @IsString()
  registrationKey: string;
}
