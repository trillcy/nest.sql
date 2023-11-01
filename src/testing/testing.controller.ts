import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { BlogsRepo } from 'src/blogs/blogs.repo';
import { PostsRepo } from 'src/posts/posts.repo';
import { UsersService } from 'src/users/users.service';
import { CommentsRepo } from 'src/comments/comments.repo';
import { Response } from 'express';
import { DevicesRepo } from 'src/devices/devices.repo';
import { AuthService } from 'src/auth/auth.service';
import { DeleteAllDataUseCase } from 'src/testing/use-cases/delete-all-data-use-case';
import { UsersRepo } from 'src/users/users.repo';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly deleteAllDataUseCase: DeleteAllDataUseCase,
    private readonly usersRepo: UsersRepo,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/all-data')
  async deleteAll(@Res({ passthrough: true }) res: Response) {
    console.log('47---testing.co');

    return await this.deleteAllDataUseCase.execute();
    return res.sendStatus(HttpStatus.NO_CONTENT); //204
  }
}
