import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepo } from 'src/users/users.repo';
import { UsersService } from 'src/users/users.service';

const REFRESH_TOKEN_KEY = "'osf'ihOI'OIVCJUAEG'";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refreshStrategy',
) {
  constructor(private readonly usersRepo: UsersRepo) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: REFRESH_TOKEN_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepo.findByLogin(payload.userLogin);
    if (!user) throw new UnauthorizedException();
    return { ...payload };
  }
}
