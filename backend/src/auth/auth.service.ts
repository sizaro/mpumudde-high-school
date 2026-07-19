import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto.js';


@Injectable()
export class AuthService {


  constructor(
    private readonly prisma: PrismaService,

    private readonly jwtService: JwtService,
  ) {}



  async login(
    loginDto: LoginDto,
  ) {


    const user = await this.prisma.user.findUnique({

      where: {
        email: loginDto.email,
      },

      include: {

        roles: {

          include: {

            role: {

              include: {

                permissions: {

                  include: {

                    permission: true,

                  },

                },

              },

            },

          },

        },

      },

    });



    if (!user) {

      throw new UnauthorizedException(
        'Invalid credentials',
      );

    }



    const passwordValid =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );



    if (!passwordValid) {

      throw new UnauthorizedException(
        'Invalid credentials',
      );

    }



    const roles = user.roles.map(
      userRole => userRole.role.name,
    );



    const permissions =
      user.roles.flatMap(
        userRole =>
          userRole.role.permissions.map(
            rolePermission =>
              rolePermission.permission.name,
          ),
      );



    const payload = {

      sub: user.id,

      email: user.email,

      roles,

      permissions,

    };



    return {

      access_token:
        await this.jwtService.signAsync(payload),


      user: {

        id: user.id,

        email: user.email,

        roles,

        permissions,

      },

    };

  }

}