import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersRepo } from 'src/users/users.repo';

@Injectable()
@ValidatorConstraint({ name: 'IsTrim', async: true })
export class IsStatus implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepo) {}

  validate(value: string, args: ValidationArguments): boolean {
    if (['none', 'like', 'dislike'].includes(value.toLowerCase())) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Status is incorrect`;
  }
}
