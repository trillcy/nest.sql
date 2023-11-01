import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { GetProfileUseCase } from './auth/use-cases/get-profile-use-case';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepo } from './users/users.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsRepo } from './blogs/blogs.repo';
import { PostsRepo } from './posts/posts.repo';
import { CommentsRepo } from './comments/comments.repo';
import { DevicesRepo } from './devices/devices.repo';
import { TestingController } from './testing/testing.controller';
import { DeleteAllDataUseCase } from './testing/use-cases/delete-all-data-use-case';
import { CreateTokensUseCase } from './auth/use-cases/create-tokens-use-case';
import { CheckCredentialUseCase } from './auth/use-cases/check-credential-use-case';
import { JwtService } from '@nestjs/jwt';
import { CreateUserUseCase } from './users/use-cases/create-user-use-case';
import { DeleteUserUseCase } from './users/use-cases/delete-user-use-case';
import { BasicAuthGuard } from './infrastructure/guards/basic-guard';
import { LocalAuthGuard } from './infrastructure/guards/local-guard';
import { AccessJwtAuthGuard } from './infrastructure/guards/access-jwt-guard';
import { RefreshJwtAuthGuard } from './infrastructure/guards/refresh-jwt-guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { RegistrationUseCase } from './auth/use-cases/registration-use-case';
import { BasicStrategy } from './infrastructure/strategies/basicStrtegy';
import { ManagersService } from './managers/managers.service';
import { CheckEmailExistsUseCase } from './auth/use-cases/check-email-exists-use-case';
import { CheckEmailConfirmedUseCase } from './auth/use-cases/check-email-confirmed-use-case';
import { CheckUserExistUseCase } from './users/use-cases/check-user-exist-use-case';
import { LocalStrategy } from './infrastructure/strategies/localStrtegy';
import { AccessJwtStrategy } from './infrastructure/strategies/accessJwtStrtegy';
import { RefreshJwtStrategy } from './infrastructure/strategies/refreshJwtStrtegy';
import { CheckLoginExistsUseCase } from './auth/use-cases/check-login-exists-use-case';
import { LoginDoesntExist } from './infrastructure/validators/login-doesnt-exist';
import { EmailDoesntExist } from './infrastructure/validators/email-doesnt-exist';
import { EmailExists } from './infrastructure/validators/email-exists';
import { EmailSendUseCase } from './auth/use-cases/email-send-use-case';
import { RegistrationEmailResendingUseCase } from './auth/use-cases/registration-email-resending-use-case';
import { PostsController } from './posts/posts.controller';
import { SaBlogsController } from './sa-blogs/sa-blogs.controller';
import { SaBlogsService } from './sa-blogs/sa-blogs.service';
import { CreateBlogUseCase } from './sa-blogs/sa-blogs-use-cases/create-blog-use-case';
import { CreatePostUseCase } from './sa-blogs/sa-blogs-use-cases/create-post-use-case';
import { UpdateBlogUseCase } from './sa-blogs/sa-blogs-use-cases/update-blog-use-case';
import { UpdatePostUseCase } from './sa-blogs/sa-blogs-use-cases/update-post-use-case';
import { DeletePostUseCase } from './sa-blogs/sa-blogs-use-cases/delete-post-use-case';
import { DeleteBlogUseCase } from './sa-blogs/sa-blogs-use-cases/delete-blog-use-case';
import { IsTrim } from './infrastructure/validators/is-trim';
import { CommentsController } from './comments/comments.controller';
import { DeleteCommentByIdUseCase } from './comments/comments-use-cases/delete-comment-by-id-use-case';
import { UpdateCommentUseCase } from './comments/comments-use-cases/update-comment-use-case';
import { CreateCommentUseCase } from './posts/posts-use-cases/create-comment-use-case';
import { PostLikesRepo } from './post-likes/post-likes.repo';
import { CommentLikesRepo } from './comment-likes/comment-likes.repo';
import { LikeCommentUseCase } from './comments/comments-use-cases/like-comment-use-case';
import { IsStatus } from './infrastructure/validators/is-status';
import { LikePostUseCase } from './posts/posts-use-cases/like-post-use-case';
import { NotStrikeJwtAuthGuard } from './infrastructure/guards/not-strike-jwt-guard';
import { NotStrikeJwtStrategy } from './infrastructure/strategies/notStrikeJwtStrtegy';

const services = [
  AppService,
  AuthService,
  UsersService,
  BlogsRepo,
  PostsRepo,
  CommentsRepo,
  DevicesRepo,
  JwtService,
  ManagersService,
  LoginDoesntExist,
  EmailDoesntExist,
  EmailExists,
  IsTrim,
  IsStatus,
  SaBlogsService,
  PostLikesRepo,
  CommentLikesRepo,
];
const adapters = [UsersRepo];
const useCases = [
  GetProfileUseCase,
  DeleteAllDataUseCase,
  CreateTokensUseCase,
  CheckCredentialUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  RegistrationUseCase,
  RegistrationEmailResendingUseCase,
  CheckEmailExistsUseCase,
  CheckLoginExistsUseCase,
  CheckEmailConfirmedUseCase,
  CheckUserExistUseCase,
  EmailSendUseCase,
  CreateBlogUseCase,
  CreatePostUseCase,
  UpdateBlogUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  DeleteBlogUseCase,
  DeleteCommentByIdUseCase,
  UpdateCommentUseCase,
  CreateCommentUseCase,
  LikeCommentUseCase,
  LikePostUseCase,
];
const guards = [
  BasicAuthGuard,
  LocalAuthGuard,
  AccessJwtAuthGuard,
  RefreshJwtAuthGuard,
  BasicStrategy,
  LocalStrategy,
  AccessJwtStrategy,
  RefreshJwtStrategy,
  NotStrikeJwtAuthGuard,
  NotStrikeJwtStrategy,
];
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'Solomon@2016',
      database: 'nestDB',
      autoLoadEntities: false, //true, - default. Т.к. пока используется только чистые SQL запросы, то ставим false
      synchronize: false, //true, - default. Т.к. пока используется только чистые SQL запросы, то ставим false
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10,
        limit: 5,
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    BlogsController,
    TestingController,
    PostsController,
    SaBlogsController,
    CommentsController,
  ],
  providers: [...services, ...adapters, ...useCases, ...guards],
})
export class AppModule {}
