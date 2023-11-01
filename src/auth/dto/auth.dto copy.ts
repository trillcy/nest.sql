import { IsString, Length } from 'class-validator';

export class LoginOrEmailStringDto {
  @IsString()
  loginOrEmail: string;
}
export class PasswordStringDto {
  @IsString()
  password: string;
}
