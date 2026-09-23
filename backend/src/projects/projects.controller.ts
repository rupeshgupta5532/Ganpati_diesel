import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get published projects (Public)' })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  findAllPublic(@Query('featured') featured?: boolean) {
    return this.projectsService.findAllPublic(featured);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single project by slug (Public)' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.projectsService.findOneBySlug(slug);
  }
}

@ApiTags('Projects (Admin)')
@Controller('admin/projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects including unpublished' })
  findAllAdmin() {
    return this.projectsService.findAllAdmin();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
