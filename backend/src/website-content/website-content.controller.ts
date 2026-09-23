import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebsiteContentService } from './website-content.service';
import { UpdateWebsiteContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Website Content')
@Controller('website-content')
export class WebsiteContentController {
  constructor(private readonly contentService: WebsiteContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get homepage content (Public)' })
  getHomepageContent() {
    return this.contentService.getContent('homepage');
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update homepage content (Admin)' })
  updateHomepageContent(@Body() dto: UpdateWebsiteContentDto) {
    return this.contentService.updateContent('homepage', dto);
  }
}
