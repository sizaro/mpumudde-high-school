  import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller.js';

import { AuthService } from './auth.service.js';

import { JwtStrategy } from './strategies/jwt.strategy.js';

import { PrismaModule } from '../prisma/prisma.module.js';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';



@Module({

  imports: [

    PrismaModule,


    ConfigModule,


    JwtModule.registerAsync({

      imports: [
        ConfigModule,
      ],


      inject: [
        ConfigService,
      ],


      useFactory: (
        configService: ConfigService,
      ) => ({


        secret:
          configService.getOrThrow<string>(
            'JWT_SECRET',
          ),


        signOptions: {

          expiresIn: '1d',

        },


      }),


    }),


  ],



  controllers: [

    AuthController,

  ],



  providers: [

    AuthService,

    JwtStrategy,

  ],



  exports: [

    AuthService,

  ],


})


export class AuthModule {}