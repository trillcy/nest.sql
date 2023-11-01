import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepo } from 'src/users/users.repo';
import { UsersService } from 'src/users/users.service';

@ValidatorConstraint({ name: 'IsLoginExist', async: true })
@Injectable()
export class LoginDoesntExist implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}

  async validate(login: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersRepo.findByLogin(login);
    if (!user) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Login already exists`;
  }
}
