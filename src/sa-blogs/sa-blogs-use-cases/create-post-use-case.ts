import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepo } from 'src/blogs/blogs.repo';
import { PostsRepo } from 'src/posts/posts.repo';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly blogsRepo: BlogsRepo,
  ) {}

  async execute(
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
  ) {
    const blog = await this.blogsRepo.findById(blogId);

    if (!blog) throw new NotFoundException();
    const blogName = blog.name;
    const newData = [
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      new Date(), //CreatedAt
    ];

    const result = await this.postsRepo.createPost(newData);
    return result;
  }
}
