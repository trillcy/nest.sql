import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepo } from 'src/users/users.repo';

@Injectable()
@ValidatorConstraint({ name: 'IsEmailExist', async: true })
export class EmailExists implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email doesnt exist`;
  }
}
