import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepo } from 'src/blogs/blogs.repo';
import { PostsRepo } from 'src/posts/posts.repo';
import { CommentsRepo } from '../../comments/comments.repo';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly commentsRepo: CommentsRepo,
  ) {}

  async execute(
    userId: string,
    userLogin: string,
    postId: string,
    content: string,
  ) {
    const post = await this.postsRepo.findById(postId);

    if (!post) throw new NotFoundException();
    const newData = [
      content,
      userId,
      userLogin,
      new Date(), //CreatedAt
      postId,
    ];

    const result = await this.commentsRepo.createComment(newData);
    return result;
  }
}
