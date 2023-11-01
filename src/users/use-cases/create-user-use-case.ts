import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../users.repo';
import { UserInputDto } from '../dto/user-input-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepo: UsersRepo) {}

  async execute(login: string, email: string, pwd: string) {
    const passwordSalt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(pwd, passwordSalt);

    const date = new Date();
    const newData = [
      login,
      email,
      date.toISOString(), //CreatedAt
      passwordHash,
      passwordSalt,
      null, //EmailConfirmationCode: null,
      null, //EmailExpirationDate: null,
      false, //EmailIsConfirmed: false,
      null, //PasswordConfirmationCode: null,
      null, //PasswordExpirationDate: null,
      false, //PasswordIsConfirmed: false,
    ];

    const userId = await this.usersRepo.createUser([...newData]);
    const result = await this.usersRepo.findByLogin(login);
    return result;
  }
}
