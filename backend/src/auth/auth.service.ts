import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
  private prisma: PrismaService,
  private jwtService: JwtService,
) {}

  async login(email: string, password: string) {

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        director: true,
        teacher: true,
        parent: true,
      },
    });


    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }




    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );


    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const token = this.jwtService.sign({
  sub: user.id,
  email: user.email,
  role: user.role,
});

    return {
  access_token: token,

  user: {
    id: user.id,
    email: user.email,
    role: user.role,
  },
};
  }
}