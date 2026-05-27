import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../../application/auth/auth.service';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../../application/auth/jwt.guard';
import { AdminGuard } from '../../application/auth/admin.guard';

class RegisterDto {
  @IsString() @MinLength(2) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
}

class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

class ChangePasswordDto {
  @IsString() currentPassword!: string;
  @IsString() @MinLength(6) newPassword!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto.currentPassword, dto.newPassword);
  }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  findAllUsers() {
    return this.authService.findAllUsers();
  }

  @Get('stats')
  getStats() {
    return this.authService.getStats();
  }
}
