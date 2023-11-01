/*
import { Prop } from '@nestjs/mongoose';
import {
  Length,
  IsString,
  IsEmail,
  Validate,
  Validator,
} from 'class-validator';
import { IsEmailAlreadyConfirmed } from 'src/shared/validators/is-email-already-confirmed';
import { IsEmailDoesnotExist } from 'src/shared/validators/is-email-doesnot-exists';
import { IsEmailExist } from 'src/shared/validators/is-email-exists';
import { IsLoginExist } from 'src/shared/validators/is-login-exists';

export class EmailRegistrationResendDto {
  @IsString()
  @IsEmail()
  @Validate(IsEmailDoesnotExist)
  @Validate(IsEmailAlreadyConfirmed)
  email: string;
}

// export class EmailUserDto {
//   @IsString()
//   @IsEmail()
//   email: string;
// }

export class LoginStringDto {
  @IsString()
  @Validate(IsLoginExist)
  email: string;
}

export class UserInputDto {
  @IsString()
  @Length(3, 10)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsEmail()
  email: string;
}

export class UserRegistrationInputDto {
  @IsString()
  @Length(3, 10)
  @Validate(IsLoginExist)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsEmail()
  @Validate(IsEmailExist)
  email: string;
}

export class QueryUserInputDto {
  sortBy: string | null;
  sortDirection: string | null;
  pageNumber: string | null;
  pageSize: string | null;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
}

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export class PaginatorUserViewDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewDto[];
}
*/
