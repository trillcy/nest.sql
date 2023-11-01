import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // ??? можно убрать, но в этом случае надо убрать req из validate
    super({
      passReqToCallback: true,
    });
  }

  async validate(req, username: string, password: string) {
    if (username === 'admin' && password === 'qwerty') return true;
    throw new UnauthorizedException();
  }
}
