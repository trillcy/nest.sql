import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepo } from 'src/users/users.repo';

const ACCESS_TOKEN_KEY = "i;shgf;risfghsi'gh";

@Injectable()
export class NotStrikeJwtStrategy extends PassportStrategy(
  Strategy,
  'notStrikeJwtStrategy',
) {
  constructor(private readonly userRepo: UsersRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([(req, res) => {}]),
      ignoreExpiration: true, //false,
      secretOrKey: ACCESS_TOKEN_KEY,
    });
  }

  async validate(payload: any) {
    console.log('23+not-strike-strategy', payload ? payload : '*********');
    if (!payload) return { userId: null };

    const user = await this.userRepo.findByLogin(payload.userLogin);
    console.log('25+not-strike-strategy', user);

    return { ...payload };
  }
}
