import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ReviewStatus } from './enums/review-status.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all approved reviews (Public)' })
  findAllPublic() {
    return this.reviewsService.findAllPublic();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new review for a booking' })
  create(@CurrentUser() user: any, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(user.userId, createReviewDto);
  }
}

@ApiTags('Reviews (Admin)')
@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews (pending, approved, rejected)' })
  findAllAdmin() {
    return this.reviewsService.findAllAdmin();
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a review' })
  approve(@Param('id') id: string) {
    return this.reviewsService.updateStatus(id, ReviewStatus.APPROVED);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a review' })
  reject(@Param('id') id: string) {
    return this.reviewsService.updateStatus(id, ReviewStatus.REJECTED);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review completely' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
