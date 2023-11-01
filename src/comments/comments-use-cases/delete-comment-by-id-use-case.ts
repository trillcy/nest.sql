import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepo } from '../comments.repo';

@Injectable()
export class DeleteCommentByIdUseCase {
  constructor(private readonly commentsRepo: CommentsRepo) {}

  async execute(commentId: string, userId: string) {
    const comment = await this.commentsRepo.findById(commentId);

    if (!comment) throw new NotFoundException();
    if (comment.commentatorInfo.userId !== userId)
      throw new ForbiddenException();

    const result = await this.commentsRepo.deleteCommentById(commentId);
    return result;
  }
}
