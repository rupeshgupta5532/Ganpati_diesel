import { IsEnum, IsString, IsOptional } from 'class-validator';
import { EnquiryStatus } from '../enums/enquiry-status.enum';

export class UpdateEnquiryDto {
  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
