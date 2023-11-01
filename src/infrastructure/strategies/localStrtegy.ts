import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserViewDto } from 'src/users/dto/user-view-dto';
import { CheckCredentialUseCase } from 'src/auth/use-cases/check-credential-use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly checkCredentialUseCase: CheckCredentialUseCase) {
    // по умолчанию должны быть поля username и password
    // чтобы поменять на нужное надо передать в super
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(loginOrEmail: string, password: string) {
    const user: UserViewDto | null = await this.checkCredentialUseCase.execute({
      loginOrEmail,
      password,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
