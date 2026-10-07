import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { RedisService } from '../redis/redis.service';
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
    private mailService: MailService,
    private redisService: RedisService,
  ) {}


  
  async githubLogin(profile: {
    githubId: string;
    email: string;
    name: string;
    profileImage?: string;
  }) {
    let user = await this.userModel.findOne({ githubId: profile.githubId });
    if (user) {
      if (!user.isActive) throw new UnauthorizedException('User is deactivated');
      return this.generateTokens(user._id.toString(), user.email, user.role);
    }

    user = await this.userModel.findOne({ email: profile.email });
    if (user) {
      if (!user.isActive) throw new UnauthorizedException('User is deactivated');
      user.githubId = profile.githubId;
      user.authProvider = 'github';
      await user.save();
      return this.generateTokens(user._id.toString(), user.email, user.role);
    }

    user = new this.userModel({
      name: profile.name,
      email: profile.email,
      githubId: profile.githubId,
      role: Role.USER,
      authProvider: 'github',
      profileImage: profile.profileImage,
      isActive: true,
    });
    await user.save();

    return this.generateTokens(user._id.toString(), user.email, user.role);
  }

  async googleLogin(profile:{
    googleId:string,
    email:string,
    name:string,
    profileImage?:string
  }){

    let user = await this.userModel.findOne({
      googleId:profile.googleId
    })
    if(user){
      if(!user.isActive){
        throw new UnauthorizedException('User is DeActivated');
      }

      return this.generateTokens(
        user._id.toString(),
        user.email,
        user.role
      );
    }

    user = await this.userModel.findOne({
      email:profile.email
    })

    if(user){
      if (!user.isActive) {
       throw new UnauthorizedException('User is deactivated');      
      }
      user.googleId = profile.googleId;
      user.authProvider = 'google';

      await user.save()

      return this.generateTokens(
        user._id.toString(),
        user.email,
        user.role
      )

    }


    user = new this.userModel({
      name:profile.name,
      email:profile.email,
      googleId:profile.googleId,
      role:Role.USER,
      authProvider:'google',
      profileImage:profile.profileImage,
      isActive:true
    })

    await user.save()

    return this.generateTokens(
      user._id.toString(),
      user.email,
      user.role
    )

  }

  async userSignup(signupDto: SignupDto) {
    const existingUser = await this.userModel.findOne({
      email: signupDto.email,
    });
    if (existingUser) throw new ConflictException('Email already in use');

    if (!signupDto.otp) {
      // Step 1: Send OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.redisService.set(`signup_otp:${signupDto.email}`, otp, 900); // 15 mins
      await this.mailService.sendSignupOtp(signupDto.email, otp);
      return { requiresOtp: true, message: 'OTP sent to email for verification' };
    }

    // Step 2: Verify OTP
    const storedOtp = await this.redisService.get(`signup_otp:${signupDto.email}`);
    if (!storedOtp || storedOtp !== signupDto.otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Valid OTP, proceed with registration
    await this.redisService.del(`signup_otp:${signupDto.email}`);

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

  async login(loginDto: LoginDto) {
    // 1. Try to find the user
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (user) {
      const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
      if (isMatch) {
        if (!user.isActive) throw new UnauthorizedException('User is deactivated');
        return this.generateTokens(user._id.toString(), user.email, user.role);
      }
    }

    // 2. If no user found or password didn't match, try admin
    const admin = await this.adminModel.findOne({ email: loginDto.email });
    if (admin) {
      const isMatch = await bcrypt.compare(loginDto.password, admin.passwordHash);
      if (isMatch) {
        if (!admin.isActive) throw new UnauthorizedException('Admin is deactivated');
        return this.generateTokens(admin._id.toString(), admin.email, admin.role);
      }
    }

    // 3. If neither worked
    throw new UnauthorizedException('Invalid credentials');
  }

  async processGoogleLogin(code: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
    const redirectUri = 'http://localhost:5000/api/v1/auth/google/callback';

    const bodyParams: Record<string, string> = {
      client_id: clientId || '',
      client_secret: clientSecret || '',
      code: code || '',
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    };

    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(bodyParams),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(`Google token error: ${tokenData.error_description || tokenData.error}`);
    }

    // 2. Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = await userResponse.json();
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    const email = userInfo.email;
    const name = userInfo.name || email.split('@')[0];

    // 3. Check if user exists
    let user = await this.userModel.findOne({ email });

    if (!user) {
      // Create new user (Generate a random password since passwordHash is required)
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      
      user = new this.userModel({
        name,
        email,
        passwordHash,
        role: Role.USER,
        isActive: true,
      });
      await user.save();
    }

    return this.generateTokens(user._id.toString(), user.email, user.role);
  }

  async processGithubLogin(code: string) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/github/callback';

    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify({
        client_id: clientId || '',
        client_secret: clientSecret || '',
        code: code || '',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      throw new Error(`Github token error: ${tokenData.error_description || tokenData.error}`);
    }

    // 2. Get user info from Github
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github.v3+json'
      },
    });

    const userInfo = await userResponse.json();
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info from Github');
    }

    // 3. Get user emails (primary)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github.v3+json'
      },
    });
    
    const emails = await emailResponse.json();
    if (!emailResponse.ok) {
      throw new Error('Failed to fetch user emails from Github');
    }

    const primaryEmailObj = emails.find((e: any) => e.primary) || emails[0];
    if (!primaryEmailObj) {
      throw new Error('No email found linked to Github account');
    }

    const email = primaryEmailObj.email;
    const name = userInfo.name || userInfo.login || email.split('@')[0];

    // 4. Find or Create User
    let user = await this.userModel.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      
      user = new this.userModel({
        name,
        email,
        passwordHash,
        role: Role.USER,
        isActive: true,
      });
      await user.save();
    }

    return this.generateTokens(user._id.toString(), user.email, user.role);
  }

  
  async forgotPassword(email: string) {
    let user = await this.userModel.findOne({ email });
    let isUser = true;
    if (!user) {
      user = await this.adminModel.findOne({ email }) as any;
      isUser = false;
    }
    
    if (!user) {
      throw new UnauthorizedException('No account found with that email address.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expires;
    await user.save();

    await this.mailService.sendPasswordResetOtp(email, otp);

    return { success: true, message: 'If email exists, OTP sent' };
  }

  async verifyResetOtp(email: string, otp: string) {
    let user = await this.userModel.findOne({ email, resetPasswordOtp: otp, resetPasswordExpires: { $gt: new Date() } });
    
    if (!user) {
      user = await this.adminModel.findOne({ email, resetPasswordOtp: otp, resetPasswordExpires: { $gt: new Date() } }) as any;
    }

    if (!user) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    return { success: true, message: 'OTP verified successfully' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    let user = await this.userModel.findOne({ email, resetPasswordOtp: otp, resetPasswordExpires: { $gt: new Date() } });
    let isUser = true;
    
    if (!user) {
      user = await this.adminModel.findOne({ email, resetPasswordOtp: otp, resetPasswordExpires: { $gt: new Date() } }) as any;
      isUser = false;
    }

    if (!user) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    user.resetPasswordOtp = "" as any;
    user.resetPasswordExpires = null as any;
    
    await user.save();
    return { success: true, message: 'Password reset successfully' };
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
