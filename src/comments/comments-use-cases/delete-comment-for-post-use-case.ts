import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepo } from '../comments.repo';
import { PostsRepo } from 'src/posts/posts.repo';

@Injectable()
export class DeleteCommentForPostUseCase {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly commentsRepo: CommentsRepo,
  ) {}

  async execute(postId: string) {
    const post = await this.postsRepo.findById(postId);

    if (!post) throw new NotFoundException();

    const result = await this.commentsRepo.deleteCommentsForPosts([postId]);
    return result;
  }
}
