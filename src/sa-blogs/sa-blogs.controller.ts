import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BlogIdDto } from 'src/blogs/blogs-dto/blog-id-dto';
import { BlogsPagination } from 'src/blogs/blogs-dto/blogs-pagination-dto';
import { BlogsRepo } from 'src/blogs/blogs.repo';
import { BasicAuthGuard } from 'src/infrastructure/guards/basic-guard';
import { PostsPagination } from 'src/posts/posts-dto/posts-pagination-dto';
import { PostsRepo } from 'src/posts/posts.repo';
import { CreateBlogDto } from './sa-blogs-dto/create-blog-dto';
import { CreateBlogUseCase } from './sa-blogs-use-cases/create-blog-use-case';
import { CreatePostDto } from './sa-blogs-dto/create-post-dto';
import { CreatePostUseCase } from './sa-blogs-use-cases/create-post-use-case';
import { UpdateBlogUseCase } from './sa-blogs-use-cases/update-blog-use-case';
import { BlogIdPostIdDto } from 'src/blogs/blogs-dto/blog-id-post-id-dto';
import { UpdatePostUseCase } from './sa-blogs-use-cases/update-post-use-case';
import { Response } from 'express';
import { DeleteBlogUseCase } from './sa-blogs-use-cases/delete-blog-use-case';
import { DeletePostUseCase } from './sa-blogs-use-cases/delete-post-use-case';
import { UserId } from 'src/infrastructure/decorators/userId.decorator';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class SaBlogsController {
  constructor(
    private readonly blogsRepo: BlogsRepo,
    private readonly postsRepo: PostsRepo,
    private readonly createBlogUseCase: CreateBlogUseCase,
    private readonly updateBlogUseCase: UpdateBlogUseCase,
    private readonly deleteBlogUseCase: DeleteBlogUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Delete('/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlogPost(
    @Param() ids: BlogIdPostIdDto,
    // @Res({ passthrough: true }) res: Response,
  ) {
    return await this.deletePostUseCase.execute(ids.blogId, ids.postId);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(
    @Param() id: BlogIdDto,
    // @UserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.deleteBlogUseCase.execute(id.blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Post('/:blogId/posts')
  async createPost(@Param() blogId: BlogIdDto, @Body() data: CreatePostDto) {
    const result = await this.createPostUseCase.execute(
      blogId.blogId,
      data.title,
      data.shortDescription,
      data.content,
    );

    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Put('/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlogPost(
    @Body() data: CreatePostDto,
    @Param() ids: BlogIdPostIdDto,
  ) {
    const result = await this.updatePostUseCase.execute(
      ids.blogId,
      ids.postId,
      data.title,
      data.shortDescription,
      data.content,
    );

    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Put('/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param() blogId: BlogIdDto, @Body() data: CreateBlogDto) {
    const result = await this.updateBlogUseCase.execute(
      blogId.blogId,
      data.name,
      data.description,
      data.websiteUrl,
    );

    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() data: CreateBlogDto) {
    const result = await this.createBlogUseCase.execute(
      data.name,
      data.description,
      data.websiteUrl,
    );

    return result;
  }

  @Get()
  async getAllBlogs(@Query() query: BlogsPagination) {
    const result = await this.blogsRepo.findAll(query);
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Get(':blogId/posts')
  async getAllPostsForBlog(
    @Query() query: PostsPagination,
    @Param() blogId: BlogIdDto,
    @UserId() userId: string,
  ) {
    const blog = await this.blogsRepo.findById(blogId.blogId);
    if (!blog) throw new NotFoundException();
    const result = await this.postsRepo.findAllForBlogWithLikes(
      blogId.blogId,
      query,
      userId,
    );
    return result;
  }
}
