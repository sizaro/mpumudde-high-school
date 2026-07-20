import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';


import type { Response } from 'express';


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

    @Res({ passthrough: true }) response: Response,

  ) {


    const result =
      await this.authService.login(loginDto);




    response.cookie(

  'access_token',

  result.access_token,

  {

    httpOnly: true,

    secure: process.env.NODE_ENV === 'production',

    sameSite:
      process.env.NODE_ENV === 'production'
        ? 'none'
        : 'lax',

    maxAge:
      24 * 60 * 60 * 1000,

  },

);




    return {

      user: result.user,

    };


  }





  @UseGuards(JwtAuthGuard)

  @Get('me')

  async me(

    @Req() req: any,

  ) {


    return req.user;


  }


}