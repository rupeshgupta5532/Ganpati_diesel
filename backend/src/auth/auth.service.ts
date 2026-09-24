import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Admin, AdminDocument } from '../admins/schemas/admin.schema';
import { SignupDto } from './dto/signup.dto';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  async userSignup(signupDto: SignupDto) {
    const existingUser = await this.userModel.findOne({
      email: signupDto.email,
    });
    if (existingUser) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(signupDto.password, 10);
    const newUser = new this.userModel({
      ...signupDto,
      passwordHash,
      role: Role.USER,
    });

    await newUser.save();
    return this.generateTokens(
      newUser._id.toString(),
      newUser.email,
      newUser.role,
    );
  }

  async userLogin(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('User is deactivated');

    return this.generateTokens(user._id.toString(), user.email, user.role);
  }

  async adminSignup(adminSignupDto: AdminSignupDto) {
    const adminKey = process.env.ADMIN_REGISTRATION_KEY || 'default-admin-key';
    if (adminSignupDto.registrationKey !== adminKey) {
      throw new ForbiddenException('Invalid registration key');
    }

    const existingAdmin = await this.adminModel.findOne({
      email: adminSignupDto.email,
    });
    if (existingAdmin) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(adminSignupDto.password, 10);
    const newAdmin = new this.adminModel({
      name: adminSignupDto.name,
      email: adminSignupDto.email,
      passwordHash,
      role: Role.ADMIN,
    });

    await newAdmin.save();
    return this.generateTokens(
      newAdmin._id.toString(),
      newAdmin.email,
      newAdmin.role,
    );
  }

  async adminLogin(loginDto: LoginDto) {
    const admin = await this.adminModel.findOne({ email: loginDto.email });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(loginDto.password, admin.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!admin.isActive)
      throw new UnauthorizedException('Admin is deactivated');

    return this.generateTokens(admin._id.toString(), admin.email, admin.role);
  }

  
  async getProfile(userId: string, role: string) {
    if (role === Role.USER) {
      const user = await this.userModel.findById(userId).select('-passwordHash -refreshTokenHash').exec();
      if (!user) throw new UnauthorizedException('User not found');
      return user;
    } else {
      const admin = await this.adminModel.findById(userId).select('-passwordHash -refreshTokenHash').exec();
      if (!admin) throw new UnauthorizedException('Admin not found');
      return admin;
    }
  }

  async updateProfile(userId: string, role: string, updateData: any) {
    const data = { ...updateData };
    delete data.passwordHash;
    delete data.role;
    delete data.isActive;

    if (role === Role.USER) {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, { new: true }).select('-passwordHash -refreshTokenHash').exec();
      return { success: true, data: updatedUser };
    } else {
      const updatedAdmin = await this.adminModel.findByIdAndUpdate(userId, data, { new: true }).select('-passwordHash -refreshTokenHash').exec();
      return { success: true, data: updatedAdmin };
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1d' }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      }),
    ]);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    if (role === Role.USER) {
      await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash });
    } else {
      await this.adminModel.findByIdAndUpdate(userId, { refreshTokenHash });
    }

    return { accessToken, refreshToken, user: { id: userId, email, role } };
  }
}
