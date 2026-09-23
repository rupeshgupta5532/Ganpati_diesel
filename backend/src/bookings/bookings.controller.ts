import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking (User)' })
  create(@CurrentUser() user: any, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(user.userId, createBookingDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user bookings' })
  findMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.findAllForUser(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific user booking' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingsService.findOneForUser(user.userId, id);
  }
}

@ApiTags('Bookings (Admin)')
@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  findAll() {
    return this.bookingsService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOneAdmin(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status and notes' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatusAdmin(id, updateDto);
  }

  @Patch(':id/notes')
  @ApiOperation({ summary: 'Update admin notes' })
  updateNotes(
    @Param('id') id: string,
    @Body('adminNotes') adminNotes: string,
  ) {
    return this.bookingsService.updateStatusAdmin(id, { status: undefined, adminNotes } as any);
  }

}
