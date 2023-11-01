import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsPagination } from './blogs-dto/blogs-pagination-dto';
import { BlogsRepo } from './blogs.repo';
import { BlogIdDto } from './blogs-dto/blog-id-dto';
import { PostsPagination } from 'src/posts/posts-dto/posts-pagination-dto';
import { PostsRepo } from 'src/posts/posts.repo';
import { UserId } from 'src/infrastructure/decorators/userId.decorator';
import { AccessJwtAuthGuard } from 'src/infrastructure/guards/access-jwt-guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsRepo: BlogsRepo,
    private readonly postsRepo: PostsRepo,
  ) {}

  @Get('/:blogId')
  async getrBlog(@Param() blogId: BlogIdDto) {
    const result = await this.blogsRepo.findById(blogId.blogId);
    if (!result) throw new NotFoundException();
    return result;
  }
  @UseGuards(AccessJwtAuthGuard)
  @Get('/:blogId/posts')
  async getAllPostsForBlog(
    @Query() query: PostsPagination,
    @Param() blogId: BlogIdDto,
    @UserId() userId: string,
  ) {
    if (!blogId.blogId) throw new NotFoundException();
    const blog = await this.blogsRepo.findById(blogId.blogId);
    if (!blog) throw new NotFoundException();
    const result = await this.postsRepo.findAllForBlogWithLikes(
      blogId.blogId,
      query,
      userId,
    );
    return result;
  }

  @Get()
  async getAllBlogs(@Query() query: BlogsPagination) {
    const result = await this.blogsRepo.findAll(query);
    return result;
  }
}
