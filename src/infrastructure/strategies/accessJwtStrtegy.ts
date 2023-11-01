import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepo } from 'src/users/users.repo';

const ACCESS_TOKEN_KEY = "i;shgf;risfghsi'gh";

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  'accessStrategy',
) {
  constructor(private readonly userRepo: UsersRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([(req, res) => {}]),
      ignoreExpiration: false,
      secretOrKey: ACCESS_TOKEN_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepo.findByLogin(payload.userLogin);
    if (!user) throw new UnauthorizedException();

    return { ...payload };
  }
}
