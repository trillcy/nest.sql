import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepo } from 'src/blogs/blogs.repo';
import { CommentsRepo } from 'src/comments/comments.repo';
import { PostsRepo } from 'src/posts/posts.repo';

@Injectable()
export class DeleteBlogUseCase {
  constructor(
    private readonly blogsRepo: BlogsRepo,
    private readonly postsRepo: PostsRepo,
    private readonly commentsRepo: CommentsRepo,
  ) {}

  async execute(blogId: string) {
    const blog = await this.blogsRepo.findById(blogId);
    if (!blog) throw new NotFoundException();
    const posts = await this.postsRepo.findAllForBlog(blogId);
    if (posts.items.length) {
      const postIds = posts.items.map((i) => {
        return i.id;
      });
      if (postIds.length) {
        const deletedComments =
          await this.commentsRepo.deleteCommentsForPosts(postIds);
      }
      const deletedPosts = await this.postsRepo.deletePostsForBlogs([blogId]);
    }
    const result = await this.blogsRepo.deleteBlog(blogId);
    return result;
  }
}
