import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const existing = await this.projectModel.findOne({
      slug: createProjectDto.slug,
    });
    if (existing)
      throw new ConflictException('Project with this slug already exists');

    return this.projectModel.create(createProjectDto);
  }

  async findAllPublic(isFeatured?: boolean) {
    const filter: any = { isPublished: true };
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }
    return this.projectModel
      .find(filter)
      .sort({ projectDate: -1, createdAt: -1 })
      .exec();
  }

  async findOneBySlug(slug: string) {
    const project = await this.projectModel
      .findOne({ slug, isPublished: true })
      .exec();
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findAllAdmin() {
    return this.projectModel.find().sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const updated = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Project not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Project not found');
    return { success: true, message: 'Project deleted' };
  }
}
