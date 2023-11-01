import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepo } from 'src/blogs/blogs.repo';
import { DeleteCommentByIdUseCase } from 'src/comments/comments-use-cases/delete-comment-by-id-use-case';
import { CommentsRepo } from 'src/comments/comments.repo';
import { PostsRepo } from 'src/posts/posts.repo';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly blogsRepo: BlogsRepo,
    private readonly commentsRepo: CommentsRepo,
    private readonly deleteCommentUseCase: DeleteCommentByIdUseCase,
  ) {}

  async execute(blogId: string, postId: string) {
    const post = await this.postsRepo.findById(postId);
    if (!post) throw new NotFoundException();
    const blog = await this.blogsRepo.findById(blogId);
    if (!blog) throw new NotFoundException();
    if (post.blogId !== blogId) throw new NotFoundException();
    const deletedComments = await this.commentsRepo.deleteCommentsForPosts([
      postId,
    ]);
    const result = await this.postsRepo.deletePostById(postId);
    return result;
  }
}
