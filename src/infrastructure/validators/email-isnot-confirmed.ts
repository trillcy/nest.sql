import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepo } from 'src/users/users.repo';

@Injectable()
@ValidatorConstraint({ name: 'IsEmailExist', async: true })
export class EmailIsnotConfirmed implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    const emailData = await this.usersRepo.findEmailData(email);
    if (emailData.emailIsConfirmed) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email is already confirmed`;
  }
}
