import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepo } from '../users.repo';
import { UserInputDto } from '../dto/user-input-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CheckUserExistUseCase {
  constructor(private readonly usersRepo: UsersRepo) {}

  async execute(login: string, email: string) {
    const userLogin = await this.usersRepo.findByLogin(login);
    if (userLogin)
      throw new BadRequestException([
        { message: 'user exists', field: 'login' },
      ]);
    const userEmail = await this.usersRepo.findByEmail(email);
    if (userEmail)
      throw new BadRequestException([
        { message: 'user exists', field: 'email' },
      ]);
    return true;
  }
}
