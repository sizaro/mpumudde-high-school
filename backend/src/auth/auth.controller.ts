import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from './auth.service.js';

import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,

    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.login(loginDto);

      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions: { httpOnly: true; secure: boolean; sameSite: 'none' | 'lax'; maxAge: number } = {
        httpOnly: true,
        secure: isProduction,
        // SameSite=None requires Secure, so browsers reject it over plain http in dev
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      };

      response.cookie('access_token', result.access_token, cookieOptions);

      return {
        access_token: result.access_token,
        user: result.user,
      };
    } catch (error) {
      console.error('AuthController.login error:', error instanceof Error ? error.stack ?? error.message : error);
      throw error;
    }
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async register(
    @Body() registerDto: RegisterDto,

    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerDto);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions: { httpOnly: true; secure: boolean; sameSite: 'none' | 'lax'; maxAge: number } = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    };

    response.cookie('access_token', result.access_token, cookieOptions);

    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
