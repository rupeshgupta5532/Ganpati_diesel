import { IsEnum, IsString, IsOptional } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
