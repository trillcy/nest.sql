import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../users.repo';
import { UserInputDto } from '../dto/user-input-dto';
import bcrypt from 'bcrypt';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly usersRepo: UsersRepo) {}

  async execute(userId: string): Promise<boolean> {
    const [_, deletedCount] = await this.usersRepo.deleteUser(userId);

    return deletedCount;
  }
}
