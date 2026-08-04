import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';



@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {



  constructor(

    private readonly configService: ConfigService,

  ) {


    const cookieExtractor = (request: any) => request?.cookies?.access_token;
    const authHeaderExtractor = (request: any) => {
      const authorization = request?.headers?.authorization || request?.headers?.Authorization;
      if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
        return authorization.slice(7);
      }
      return null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, authHeaderExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });


  }




  async validate(payload: {

    sub: string;

    email: string;

    roles: string[];

    permissions: string[];

  }) {



    return {


      id: payload.sub,


      email: payload.email,


      roles: payload.roles,


      permissions: payload.permissions,


    };


  }


}