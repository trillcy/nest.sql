import { Injectable } from '@nestjs/common';
import { UserViewDto } from 'src/users/dto/user-view-dto';
import { UsersRepo } from 'src/users/users.repo';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class CheckCredentialUseCase {
  constructor(private readonly usersRepo: UsersRepo) {}

  async execute(data: LoginDto): Promise<UserViewDto | null> {
    const user = await this.usersRepo.findUserByLoginOrEmail(data.loginOrEmail);

    if (!user) return null;
    const passwordHash = await bcrypt.hash(data.password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) return null;
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
