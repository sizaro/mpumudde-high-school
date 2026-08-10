import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';



@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {



  constructor(

    private readonly configService: ConfigService,

    private readonly prisma: PrismaService,

  ) {


    const cookieExtractor = (request: any) => request?.cookies?.access_token;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });


  }




  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        isActive: true,
        isLoggedIn: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
                permissions: {
                  select: { permission: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive || !user.isLoggedIn) {
      throw new UnauthorizedException('Your session is no longer active.');
    }

    return {
      id: user.id,
      email: user.email,
      roles: user.roles.map(({ role }) => role.name),
      permissions: [
        ...new Set(
          user.roles.flatMap(({ role }) =>
            role.permissions.map(({ permission }) => permission.name),
          ),
        ),
      ],
    };


  }


}
