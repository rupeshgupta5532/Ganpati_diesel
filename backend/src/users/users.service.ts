import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(query: QueryUserDto) {
    const { search, isActive, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .select('-passwordHash -refreshTokenHash')
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      success: true,
      message: 'Users retrieved successfully',
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-passwordHash -refreshTokenHash')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-passwordHash -refreshTokenHash')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { success: true, message: 'User deleted successfully', data: null };
  }
}
