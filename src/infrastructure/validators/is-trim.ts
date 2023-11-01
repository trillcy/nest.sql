import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepo } from 'src/users/users.repo';

@Injectable()
@ValidatorConstraint({ name: 'IsTrim', async: true })
export class IsTrim implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}

  validate(value: string, args: ValidationArguments): boolean {
    const newString = value.trim();
    if (!newString) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Parameter is empty`;
  }
}
