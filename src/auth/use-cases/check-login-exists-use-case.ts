import { BadRequestException, Injectable } from '@nestjs/common';
import { UserViewDto } from 'src/users/dto/user-view-dto';
import { UsersRepo } from 'src/users/users.repo';
@Injectable()
export class CheckLoginExistsUseCase {
  constructor(private readonly usersRepo: UsersRepo) {}

  async execute(login: string): Promise<boolean> {
    const result = await this.usersRepo.findByLogin(login);
    console.log('10==login exists');

    if (result) {
      return true;
    } else {
      return false;
    }
  }
}
