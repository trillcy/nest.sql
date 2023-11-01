import { Injectable } from '@nestjs/common';
import { UsersRepo } from 'src/users/users.repo';

@Injectable()
export class GetProfileUseCase {
  constructor(private usersRepo: UsersRepo) {}

  async execute(userId: string) {
    return await this.usersRepo.findProfileById(userId);
  }
}
