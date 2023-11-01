import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsRepo } from './posts.repo';
import { PostsPagination } from './posts-dto/posts-pagination-dto';
import { PostIdDto } from './posts-dto/post-id-dto';
import { CommentsPaginationDto } from 'src/comments/comments-dto/comments-pagination-dto';
import { CommentsRepo } from 'src/comments/comments.repo';
import { AccessJwtAuthGuard } from 'src/infrastructure/guards/access-jwt-guard';
import { UserId } from 'src/infrastructure/decorators/userId.decorator';
import { UserLogin } from 'src/infrastructure/decorators/userLogin.decorator';
import { CreateCommentDto } from 'src/comments/comments-dto/create-comment-dto';
import { CreateCommentUseCase } from './posts-use-cases/create-comment-use-case';
import { LikeCommentDto } from 'src/comments/comments-dto/like-comment-dto';
import { LikePostUseCase } from './posts-use-cases/like-post-use-case';
import { NotStrikeJwtAuthGuard } from 'src/infrastructure/guards/not-strike-jwt-guard';
import { AuthGuard } from 'src/infrastructure/guards/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly commentsRepo: CommentsRepo,
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly likePostUseCase: LikePostUseCase,
  ) {}

  @UseGuards(AccessJwtAuthGuard)
  @Put('/:postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async likePost(
    @Param() postId: PostIdDto,
    @Body() data: LikeCommentDto,
    @UserId() userId: string,
    @UserLogin() userLogin: string,
  ) {
    const result = await this.likePostUseCase.execute(
      userId,
      userLogin,
      postId.postId,
      data.likeStatus,
    );

    return result;
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('/:postId/comments')
  async createPost(
    @Param() postId: PostIdDto,
    @Body() data: CreateCommentDto,
    @UserId() userId: string,
    @UserLogin() userLogin: string,
  ) {
    const result = await this.createCommentUseCase.execute(
      userId,
      userLogin,
      postId.postId,
      data.content,
    );

    return result;
  }

  @Get(':postId/comments')
  async getAllCommentsForPost(
    @Query() query: CommentsPaginationDto,
    @Param() postId: PostIdDto,
  ) {
    const post = await this.postsRepo.findById(postId.postId);

    if (!post) throw new NotFoundException();
    const result = await this.commentsRepo.findAllForPostWithLikes(
      postId.postId,
      query,
    );
    return result;
  }
  @UseGuards(AuthGuard)
  @Get(':postId')
  async getById(@Param() postId: PostIdDto, @UserId() userId: string) {
    console.log('96--posts.co', userId);

    const result = await this.postsRepo.findByIdWithLikes(
      postId.postId,
      userId || null,
    );
    // if (!result) throw new NotFoundException();
    return result;
  }
  @UseGuards(NotStrikeJwtAuthGuard)
  @Get()
  async getAllPosts(@Query() query: PostsPagination, @UserId() userId: string) {
    // console.log('103--posts.co', userId);

    const result = await this.postsRepo.findAllWithLikes(query, userId);
    return result;
  }
}
