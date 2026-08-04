import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';


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



    if (!user || !user.isActive) {

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

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        isLoggedIn: true,
      },
    });


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

    const existingParent = registerDto.role === 'PARENT'
      ? await this.prisma.parent.findFirst({
          where: {
            email: registerDto.email,
            userId: null,
          },
          orderBy: { createdAt: 'asc' },
        })
      : null;

    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        roles: { create: { roleId: role.id } },
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
            ? existingParent
              ? { connect: { id: existingParent.id } }
              : {
                  create: {
                    firstName: registerDto.firstName ?? 'Parent',
                    lastName: registerDto.lastName ?? 'User',
                    phone: registerDto.phone,
                    email: registerDto.email,
                    relationship: registerDto.relationship,
                  },
                }
            : undefined,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    const roles = newUser.roles.map(
      userRole => userRole.role.name,
    );

    const permissions = newUser.roles.flatMap((item) =>
      item.role.permissions.map((rolePermission) => rolePermission.permission.name),
    );

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        roles,
        permissions,
      },
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isLoggedIn: false },
    });
    return { message: 'Logged out successfully.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new UnauthorizedException('Your current password is incorrect.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: await bcrypt.hash(dto.newPassword, 12) },
    });

    return { message: 'Password changed successfully.' };
  }

}
