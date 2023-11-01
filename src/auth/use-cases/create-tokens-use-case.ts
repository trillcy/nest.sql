import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const ACCESS_TOKEN_KEY = "i;shgf;risfghsi'gh";
const REFRESH_TOKEN_KEY = "'osf'ihOI'OIVCJUAEG'";
const RECOVERY_TOKEN_KEY = 'lhggh-rpogjUSH4GFOllj';
const ACCESS_TOKEN_EXPIRE_TIME = (100 * 60000).toString(); //10 min
const REFRESH_TOKEN_EXPIRE_TIME = (100 * 60000).toString(); //100 min
const RECOVERY_TOKEN_EXPIRE_TIME = (100 * 60000).toString(); //10 min

@Injectable()
export class CreateTokensUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(userId: string, userLogin: string, deviceId: string) {
    // записываем devices
    // выдаем access и refresh токены

    const accessToken: string = this.jwtService.sign(
      { userId, userLogin, deviceId },
      { secret: ACCESS_TOKEN_KEY, expiresIn: ACCESS_TOKEN_EXPIRE_TIME },
    );
    const refreshToken: string = this.jwtService.sign(
      { userId, userLogin, deviceId },
      { secret: REFRESH_TOKEN_KEY, expiresIn: REFRESH_TOKEN_EXPIRE_TIME },
    );

    return { accessToken, refreshToken };
  }
}
