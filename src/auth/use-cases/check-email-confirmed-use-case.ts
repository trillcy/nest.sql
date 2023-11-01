import { Injectable } from '@nestjs/common';
import { UserViewDto } from 'src/users/dto/user-view-dto';
import { UsersRepo } from 'src/users/users.repo';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { AuthService } from '../auth.service';
@Injectable()
export class CheckEmailConfirmedUseCase {
  constructor(private readonly usersRepo: UsersRepo) {}

  async execute(email: string) {
    return await this.usersRepo.findEmailData(email);
  }
}
