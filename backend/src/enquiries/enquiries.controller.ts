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
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new enquiry (Public or Authenticated)' })
  create(@Body() createEnquiryDto: CreateEnquiryDto, @CurrentUser() user: any) {
    return this.enquiriesService.create(createEnquiryDto, user?.userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user enquiries' })
  findMyEnquiries(@CurrentUser() user: any) {
    return this.enquiriesService.findAllForUser(user.userId);
  }
}

@ApiTags('Enquiries (Admin)')
@Controller('admin/enquiries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminEnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all enquiries' })
  findAll() {
    return this.enquiriesService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get enquiry details' })
  findOne(@Param('id') id: string) {
    return this.enquiriesService.findOneAdmin(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update enquiry status and notes' })
  update(@Param('id') id: string, @Body() updateDto: UpdateEnquiryDto) {
    return this.enquiriesService.updateAdmin(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete enquiry' })
  remove(@Param('id') id: string) {
    return this.enquiriesService.removeAdmin(id);
  }
}
