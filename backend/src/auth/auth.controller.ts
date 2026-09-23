import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user or admin profile' })
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
