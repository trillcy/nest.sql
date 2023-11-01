import { Length, IsString, IsEmail } from 'class-validator';

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
