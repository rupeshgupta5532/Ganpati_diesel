import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user/signup')
  @ApiOperation({ summary: 'Register a new user' })
  userSignup(@Body() signupDto: SignupDto) {
    return this.authService.userSignup(signupDto);
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  userLogin(@Body() loginDto: LoginDto) {
    return this.authService.userLogin(loginDto);
  }

  @Post('admin/signup')
  @ApiOperation({ summary: 'Register a new admin (Requires Registration Key)' })
  adminSignup(@Body() adminSignupDto: AdminSignupDto) {
    return this.authService.adminSignup(adminSignupDto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login admin' })
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unified Login for user or admin' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @ApiOperation({ summary: 'Redirect to Google OAuth' })
  googleAuth(@Res() res: any) {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
    const redirectUri = 'http://localhost:5000/api/v1/auth/google/callback';
    const scope = 'email profile';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    res.redirect(url);
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth Callback' })
  async googleAuthRedirect(@Query('code') code: string, @Res() res: any) {
    try {
      const result = await this.authService.processGoogleLogin(code);
      const userStr = encodeURIComponent(JSON.stringify(result.user));
      res.redirect(`http://localhost:5173/oauth/callback?token=${result.accessToken}&user=${userStr}`);
    } catch (err) {
      console.error('Google OAuth Error:', err);
      res.redirect(`http://localhost:5173/oauth/callback?error=google_auth_failed`);
    }
  }

  @Get('github')
  @ApiOperation({ summary: 'Redirect to Github OAuth' })
  githubAuth(@Res() res: any) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/github/callback';
    const scope = 'user:email';
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    res.redirect(url);
  }

  @Get('github/callback')
  @ApiOperation({ summary: 'Github OAuth Callback' })
  async githubAuthRedirect(@Query('code') code: string, @Res() res: any) {
    try {
      const result = await this.authService.processGithubLogin(code);
      const userStr = encodeURIComponent(JSON.stringify(result.user));
      res.redirect(`http://localhost:5173/oauth/callback?token=${result.accessToken}&user=${userStr}`);
    } catch (err) {
      console.error('Github OAuth Error:', err);
      res.redirect(`http://localhost:5173/oauth/callback?error=github_auth_failed`);
    }
  }


  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP' })
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('verify-reset-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify reset password OTP' })
  verifyResetOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyResetOtp(body.email, body.otp);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    return this.authService.resetPassword(body.email, body.otp, body.newPassword);
  }


@Get('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get current user or admin profile' })
getProfile(@CurrentUser() user: any) {
  return this.authService.getProfile(user.userId, user.role);
}

@Patch('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Update current user or admin profile' })
updateProfile(@CurrentUser() user: any, @Body() updateData: any) {
  return this.authService.updateProfile(user.userId, user.role, updateData);
}
}
