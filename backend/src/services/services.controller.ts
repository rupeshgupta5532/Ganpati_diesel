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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active services (Public)' })
  findAllPublic() {
    return this.servicesService.findAllPublic();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single service by slug (Public)' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.servicesService.findOneBySlug(slug);
  }
}

@ApiTags('Services (Admin)')
@Controller('admin/services')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services including inactive' })
  findAllAdmin() {
    return this.servicesService.findAllAdmin();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
