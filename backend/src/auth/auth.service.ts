import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';


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


  async register(

    registerDto: RegisterDto,

  ) {

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const role = await this.prisma.role.findUnique({
      where: {
        name: registerDto.role,
      },
    });

    if (!role) {
      throw new Error('Selected role does not exist');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        roles: {
          create: {
            roleId: role.id,
          },
        },
        teacher:
          registerDto.role === 'TEACHER'
            ? {
                create: {
                  firstName: registerDto.firstName ?? 'Teacher',
                  lastName: registerDto.lastName ?? 'User',
                  phone: registerDto.phone,
                },
              }
            : undefined,
        parent:
          registerDto.role === 'PARENT'
            ? {
                create: {
                  firstName: registerDto.firstName ?? 'Parent',
                  lastName: registerDto.lastName ?? 'User',
                  phone: registerDto.phone,
                  relationship: registerDto.relationship,
                },
              }
            : undefined,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const roles = newUser.roles.map(
      userRole => userRole.role.name,
    );

    const permissions: string[] = [];

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      roles,
      permissions,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: newUser.id,
        email: newUser.email,
        roles,
        permissions,
      },
    };
  }

}