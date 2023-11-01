import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepo } from 'src/blogs/blogs.repo';
import { PostsRepo } from 'src/posts/posts.repo';

@Injectable()
export class UpdateBlogUseCase {
  constructor(
    private readonly blogsRepo: BlogsRepo,
    private readonly postsRepo: PostsRepo,
  ) {}

  async execute(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string,
  ) {
    const blog = await this.blogsRepo.findById(blogId);
    if (!blog) throw new NotFoundException();
    const data = [blogId, name, description, websiteUrl];
    const updatedPost = await this.postsRepo.updatePostForBlog(data);
    return await this.blogsRepo.updateBlog(data);
  }
}
