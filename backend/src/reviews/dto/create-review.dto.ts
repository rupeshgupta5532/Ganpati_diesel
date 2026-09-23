import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  @IsNotEmpty()
  bookingId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
