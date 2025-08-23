import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'TU_SECRETO',
    });
  }

  async validate(payload: any) {
    // payload es lo que pusiste en el token al hacer login
    return payload; // esto hace que req.user = payload
  }
}