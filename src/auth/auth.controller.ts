import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  Headers,
  Req,
  Res,
  Ip,
  HttpStatus,
  UseGuards,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserId } from 'src/infrastructure/decorators/userId.decorator';
import { LocalAuthGuard } from 'src/infrastructure/guards/local-guard';
import { LoginOrEmailStringDto, PasswordStringDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GetProfileUseCase } from 'src/auth/use-cases/get-profile-use-case';
import { DeviceId } from 'src/infrastructure/decorators/deviceId.decorator';
import { CreateTokensUseCase } from './use-cases/create-tokens-use-case';
import { CheckCredentialUseCase } from './use-cases/check-credential-use-case';
import { UserRegistrationInputDto } from './dto/user-registration-input-dto';
import { RegistrationUseCase } from './use-cases/registration-use-case';
import { CheckEmailExistsUseCase } from './use-cases/check-email-exists-use-case';
import { CheckEmailConfirmedUseCase } from './use-cases/check-email-confirmed-use-case';
import { UsersRepo } from 'src/users/users.repo';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { CheckLoginExistsUseCase } from './use-cases/check-login-exists-use-case';
import { CreateUserUseCase } from 'src/users/use-cases/create-user-use-case';
import { EmailResendInputDto } from './dto/email-resend-input-dto';
import { RegistrationEmailResendingUseCase } from './use-cases/registration-email-resending-use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly createTokensUseCase: CreateTokensUseCase,
    private readonly checkCredentialUseCase: CheckCredentialUseCase,
    private readonly checkEmailExistsUseCase: CheckEmailExistsUseCase,
    private readonly checkLoginExistsUseCase: CheckLoginExistsUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly usersRepo: UsersRepo,
    private readonly registrationUseCase: RegistrationUseCase, // private readonly authService: AuthService,
    private readonly registrationEmailResendingUseCase: RegistrationEmailResendingUseCase, // private readonly authService: AuthService,
    // private readonly usersService: UsersService,
  ) {}
  // пинимает токен в заголовке
  // возвращает {userId, login, email}
  // @UseGuards(RefreshJwtAuthGuard)
  @Get('/me')
  async getProfile(
    @UserId() userId: string,
    // passthrough нужно если мы подключаем @Res - в противном случае автоматом return ничего не возвращает
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.getProfileUseCase.execute(userId);
    return result;
    /*
    // const result = await this.usersService.findById(userId);
    if (!result) return res.sendStatus(HttpStatus.NOT_FOUND); //404
    return {
      userId: result.id,
      login: result.login,
      email: result.email,
    };
    */
  }

  // проверяет есть ли такой пользователь в БД
  // возвращает JWT accessToken - в теле ответа, refreshToken - в куках только для чтения
  // TODO: ??? попытки подключиться отслеживаются если подключен в Auth.module
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Headers('user-agent') title: string,
    // @Headers('ip') ip: string,
    @Ip() ip: string,
    // passthrough нужно если мы подключаем @Res - в противном случае автоматом return ничего не возвращает
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.checkCredentialUseCase.execute(data);
    if (!user) throw new UnauthorizedException();
    const deviceId = randomUUID();
    const result = await this.createTokensUseCase.execute(
      user.id,
      user.login,
      deviceId,
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: result.accessToken };
  }

  @Post('/registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailResending(
    @Body() email: EmailResendInputDto,
    // для вытаскивания user из Guard используем custom decorator
    // @UserId() userId: string,
    // @DeviceId() deviceId: string,
  ): Promise<any> {
    return await this.registrationUseCase.execute(email.email);
  }

  @UseGuards(ThrottlerGuard)
  @Post('/registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(
    @Body() userInput: UserRegistrationInputDto,
  ): Promise<any> {
    const { login, email, password } = userInput;

    const user = await this.createUserUseCase.execute(login, email, password);
    return await this.registrationUseCase.execute(email);
  }
  /*
  // проверяет есть ли такой пользователь в БД
  // возвращает JWT accessToken - в теле ответа, refreshToken - в куках только для чтения
  @UseGuards(RefreshJwtAuthGuard)
  @Post('/logout')
  async logout() {
    // const deletedDevice = await devicesService.deleteDevice(req.deviceId)
  }

  // по запросу клиента создает новую пару токенов
  // возвращает JWT accessToken - в теле ответа, refreshToken - в куках только для чтения
  @UseGuards(RefreshJwtAuthGuard)
  @Post('/refresh-token')
  async refreshToken(
    // passthrough нужно если мы подключаем @Res - в противном случае автоматом return ничего не возвращает
    @Res({ passthrough: true }) res: Response,
    @UserId() userId: string,
    @DeviceId() deviceId: string,
  ) {
    const result = await this.authService.createJwt(userId, deviceId);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return result.accessToken;
  }
  */
}
