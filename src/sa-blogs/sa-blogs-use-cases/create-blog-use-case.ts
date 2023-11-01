import { Injectable } from '@nestjs/common';
import { BlogsRepo } from 'src/blogs/blogs.repo';

@Injectable()
export class CreateBlogUseCase {
  constructor(private readonly blogsRepo: BlogsRepo) {}

  async execute(name: string, description: string, websiteUrl: string) {
    const newData = [
      name,
      description,
      websiteUrl,
      new Date(), //CreatedAt
      false, // isMembership,
    ];

    return await this.blogsRepo.createBlog(newData);
  }
}
