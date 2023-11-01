import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommentsRepo } from './comments.repo';
import { CommentIdDto } from './comments-dto/comment-id-dto';
import { AccessJwtAuthGuard } from 'src/infrastructure/guards/access-jwt-guard';
import { Response } from 'express';
import { DeleteCommentByIdUseCase } from './comments-use-cases/delete-comment-by-id-use-case';
import { UserId } from 'src/infrastructure/decorators/userId.decorator';
import { CreateCommentDto } from './comments-dto/create-comment-dto';
import { UpdateCommentDto } from './comments-dto/update-comment-dto';
import { UpdateCommentUseCase } from './comments-use-cases/update-comment-use-case';
import { CommentsPaginationDto } from './comments-dto/comments-pagination-dto';
import { PostIdDto } from 'src/posts/posts-dto/post-id-dto';
import { PostsRepo } from 'src/posts/posts.repo';
import { CreateCommentUseCase } from '../posts/posts-use-cases/create-comment-use-case';
import { UserLogin } from 'src/infrastructure/decorators/userLogin.decorator';
import { LikeCommentDto } from './comments-dto/like-comment-dto';
import { LikeCommentUseCase } from './comments-use-cases/like-comment-use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly commentsRepo: CommentsRepo,
    private readonly deleteCommentUseCase: DeleteCommentByIdUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly likeCommentUseCase: LikeCommentUseCase,
  ) {}

  @Get('/:commentId')
  async getrComment(@Param() commentId: CommentIdDto) {
    const result = await this.commentsRepo.findById(commentId.commentId);
    if (!result) throw new NotFoundException();
    return result;
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param() id: CommentIdDto,
    @Res({ passthrough: true }) res: Response,
    @UserId() userId: string,
  ) {
    return await this.deleteCommentUseCase.execute(id.commentId, userId);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Put('/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param() commentId: CommentIdDto,
    @Body() data: UpdateCommentDto,
    @UserId() userId: string,
  ) {
    const result = await this.updateCommentUseCase.execute(
      userId,
      commentId.commentId,
      data.content,
    );

    return result;
  }

  @UseGuards(AccessJwtAuthGuard)
  @Put('/:commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async likeComment(
    @Param() commentId: CommentIdDto,
    @Body() data: LikeCommentDto,
    @UserId() userId: string,
    @UserLogin() userLogin: string,
  ) {
    const result = await this.likeCommentUseCase.execute(
      userId,
      userLogin,
      commentId.commentId,
      data.likeStatus,
    );

    return result;
  }
}
