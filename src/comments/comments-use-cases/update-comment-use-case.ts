import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepo } from 'src/posts/posts.repo';
import { CommentsRepo } from '../comments.repo';

@Injectable()
export class UpdateCommentUseCase {
  constructor(private readonly commentsRepo: CommentsRepo) {}

  async execute(userId: string, commentId: string, content: string) {
    const comment = await this.commentsRepo.findById(commentId);

    if (!comment) throw new NotFoundException();
    if (comment.commentatorInfo.userId !== userId)
      throw new ForbiddenException();
    const data = [commentId, content];

    return await this.commentsRepo.updateComment(data);
  }
}
