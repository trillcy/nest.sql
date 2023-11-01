import { Injectable } from '@nestjs/common';
import { UserViewDto } from 'src/users/dto/user-view-dto';
import { UsersRepo } from 'src/users/users.repo';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { AuthService } from '../auth.service';
import { EmailSendUseCase } from './email-send-use-case';
@Injectable()
export class RegistrationUseCase {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly emailSendUseCase: EmailSendUseCase,
  ) {}

  async execute(email: string) {
    //: Promise<UserViewDto | null> {

    const date = new Date();
    const code: string = uuidv4();
    const expirationDate = add(date, { hours: 1, minutes: 3 });
    const newData = [
      email,
      code, //EmailConfirmationCode
      expirationDate, //EmailExpirationDate
      false, //EmailIsConfirmed
    ];
    const isUpdated = await this.usersRepo.updateEmailData(newData);
    const userEmailData = await this.usersRepo.findEmailData(email);
    console.log('29==registr.UC', userEmailData);

    return await this.emailSendUseCase.execute(code, email);
  }
}
