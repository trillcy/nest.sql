import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from 'src/infrastructure/guards/basic-guard';
import { UsersRepo } from './users.repo';
import { UserInputDto } from './dto/user-input-dto';
import { UserViewDto } from './dto/user-view-dto';
import { CreateUserUseCase } from './use-cases/create-user-use-case';
import { Response } from 'express';
import { DeleteUserUseCase } from './use-cases/delete-user-use-case';
import { CheckUserExistUseCase } from './use-cases/check-user-exist-use-case';
import { UsersPagination } from './dto/users-pagination';

@Controller('sa/users')
export class UsersController {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly checkUserExistUseCase: CheckUserExistUseCase,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getAllUsers(@Query() query: UsersPagination) {
    const result = await this.usersRepo.findAll(query);
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(
    @Body() userInput: UserInputDto,
  ): Promise<UserViewDto | null> {
    const { login, email, password } = userInput;
    const check = await this.checkUserExistUseCase.execute(login, email);
    const result = await this.createUserUseCase.execute(login, email, password);
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    // @UserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersRepo.findProfileById(id);
    if (!user) throw new NotFoundException();
    return this.deleteUserUseCase.execute(id);
  }
}
