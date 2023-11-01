import { IsString, Length, Validate, IsEmail } from 'class-validator';
import { EmailDoesntExist } from 'src/infrastructure/validators/email-doesnt-exist';
import { LoginDoesntExist } from 'src/infrastructure/validators/login-doesnt-exist';

export class UserRegistrationInputDto {
  @IsString()
  @Length(3, 10)
  @Validate(LoginDoesntExist)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @IsEmail()
  @Validate(EmailDoesntExist)
  email: string;
}
