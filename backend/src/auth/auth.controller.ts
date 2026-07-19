import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';


import { AuthService } from './auth.service.js';

import { LoginDto } from './dto/login.dto.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';



@Controller('auth')
export class AuthController {


  constructor(
    private readonly authService: AuthService,
  ) {}



  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ) {

    return this.authService.login(loginDto);

  }



  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @Req() req: any,
  ) {

    return req.user;

  }


}