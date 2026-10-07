import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({summary:'Login with Google'})
  googleLogin(){
    // Handled by passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({summary:'Google OAuth callback'})
  async googleCallback(@Req() req:any, @Res() res:any){
    try {
      const authData = await this.authService.googleLogin(req.user);
      const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://ganpatidiesel.netlify.app' : 'http://localhost:5173');
      const redirectUrl = `${frontendUrl}/oauth-callback?accessToken=${authData.accessToken}&user=${encodeURIComponent(JSON.stringify(authData.user))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://ganpatidiesel.netlify.app' : 'http://localhost:5173');
      res.redirect(`${frontendUrl}/login?error=Google_Auth_Failed`);
    }
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with GitHub' })
  githubLogin() {
    // Handled by passport
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubCallback(@Req() req: any, @Res() res: any) {
    try {
      const authData = await this.authService.githubLogin(req.user);
      const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://ganpatidiesel.netlify.app' : 'http://localhost:5173');
      const redirectUrl = `${frontendUrl}/oauth-callback?accessToken=${authData.accessToken}&user=${encodeURIComponent(JSON.stringify(authData.user))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://ganpatidiesel.netlify.app' : 'http://localhost:5173');
      res.redirect(`${frontendUrl}/login?error=GitHub_Auth_Failed`);
    }
  }

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


  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP' })
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
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
