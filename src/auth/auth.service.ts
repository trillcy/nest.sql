import { Injectable } from '@nestjs/common';
import { EmailBodyDto } from './dto/email-body-dto';
import { ManagersService } from 'src/managers/managers.service';

/*
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { UsersRepo } from 'src/users/users.repo';
import { ManagersService } from 'src/managers/managers.service';
import { AuthRepo } from './auth.repo';
import { EmailBodyDto } from 'src/managers/managers.dto';
import { UserViewDto } from 'src/users/users.dto';
import jwt from 'jsonwebtoken';
import { Device, DeviceDocument } from 'src/devices/devices.schema';
import { DevicesRepo } from 'src/devices/devices.repo';
import { TokenService } from 'src/jwt/token.service';
*/
const ACCESS_TOKEN_KEY = "i;shgf;risfghsi'gh";
const REFRESH_TOKEN_KEY = "'osf'ihOI'OIVCJUAEG'";
const RECOVERY_TOKEN_KEY = 'lhggh-rpogjUSH4GFOllj';
const ACCESS_TOKEN_EXPIRE_TIME = (10 * 60000).toString(); //10 min
const REFRESH_TOKEN_EXPIRE_TIME = (100 * 60000).toString(); //100 min
const RECOVERY_TOKEN_EXPIRE_TIME = (10 * 60000).toString(); //10 min

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
export class AuthService {
  constructor(
    private readonly managersService: ManagersService, // @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>, // @InjectModel(User.name) private userModel: Model<UserDocument>, // private readonly usersService: UsersService,
    // private readonly tokenService: TokenService,
  ) // private readonly authRepo: AuthRepo,
  {}
  /*
  async emailResending(email: string): Promise<any> {
    const user: UserViewDto | null = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    // -----
    const date = new Date();
    const emailConfirmation = {
      confirmationCode: uuidv4(),
      expirationDate: add(date, { hours: 1, minutes: 30 }),
      isConfirmed: false,
    };
    const updatedCodeUser = await this.usersService.updateEmailConfirmationUser(
      user.id,
      emailConfirmation,
    );
    if (!updatedCodeUser) {
      return null;
    }

    const emailObject: EmailBodyDto = formEmailRegistrationMessageMessage(
      emailConfirmation.confirmationCode,
      email,
    );

    return await this.managersService.sendEmailConfirmationMessage(emailObject);
  }
  */
  async sendEmailWithCode(
    confirmationCode: string,
    email: string,
  ): Promise<any> {
    console.log('84==auth.serv', confirmationCode, email);

    const emailObject: EmailBodyDto = formEmailRegistrationMessageMessage(
      confirmationCode,
      email,
    );
    console.log('90==auth.serv', emailObject);
    return await this.managersService.sendEmailConfirmationMessage(emailObject);
  }
}
