import { IsString, Length, Validate, IsEmail } from 'class-validator';
import { EmailExists } from 'src/infrastructure/validators/email-exists';
import { EmailIsnotConfirmed } from 'src/infrastructure/validators/email-isnot-confirmed';

export class EmailResendInputDto {
  @IsString()
  @IsEmail()
  @Validate(EmailExists)
  @Validate(EmailIsnotConfirmed)
  email: string;
}
