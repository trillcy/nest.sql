import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepo } from 'src/users/users.repo';
import { UsersService } from 'src/users/users.service';

@Injectable()
@ValidatorConstraint({ name: 'IsEmailExist', async: true })
export class EmailDoesntExist implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email already exists`;
  }
}
