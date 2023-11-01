import { Injectable } from '@nestjs/common';
import { UserViewDto } from 'src/users/dto/user-view-dto';
import { UsersRepo } from 'src/users/users.repo';
@Injectable()
export class CheckEmailExistsUseCase {
  constructor(private readonly usersRepo: UsersRepo) {}

  async execute(email: string): Promise<boolean> {
    const result = await this.usersRepo.findByEmail(email);
    if (result) {
      console.log('11===email exists');

      return true;
    } else {
      return false;
    }
  }
}
