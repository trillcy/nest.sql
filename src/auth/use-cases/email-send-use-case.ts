import { Injectable } from '@nestjs/common';
import { EmailBodyDto } from '../dto/email-body-dto';
import { ManagersService } from 'src/managers/managers.service';

const formEmailRegistrationMessageMessage = (code: string, email: string) => {
  const url = `https://somesite.com/confirm-registration?code=${code}`;

  const emailObject: EmailBodyDto = {
    email: email, //`aermakov72@mail.ru`,
    message: `<h1>Thank for your registration</h1>
<p>To finish registration please follow the link below:
<a href=${url}>complete registration</a>
</p>`,
    subject: `Confirmation of registration`,
  };
  return emailObject;
};

@Injectable()
export class EmailSendUseCase {
  constructor(private readonly managersService: ManagersService) {}

  async execute(confirmationCode: string, email: string): Promise<any> {
    console.log('84==auth.serv', confirmationCode, email);

    const emailObject: EmailBodyDto = formEmailRegistrationMessageMessage(
      confirmationCode,
      email,
    );
    console.log('90==auth.serv', emailObject);
    return await this.managersService.sendEmailConfirmationMessage(emailObject);
  }
}
