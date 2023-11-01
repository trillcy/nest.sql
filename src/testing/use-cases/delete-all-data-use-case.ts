import { Injectable } from '@nestjs/common';
import { BlogsRepo } from 'src/blogs/blogs.repo';
import { CommentLikesRepo } from 'src/comment-likes/comment-likes.repo';
import { CommentsRepo } from 'src/comments/comments.repo';
import { DevicesRepo } from 'src/devices/devices.repo';
import { PostLikesRepo } from 'src/post-likes/post-likes.repo';
import { PostsRepo } from 'src/posts/posts.repo';
import { UsersRepo } from 'src/users/users.repo';

@Injectable()
export class DeleteAllDataUseCase {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly devicesRepo: DevicesRepo,
    private readonly postsRepo: PostsRepo,
    private readonly blogsRepo: BlogsRepo,
    private readonly commentsRepo: CommentsRepo,
    private readonly commentLikesRepo: CommentLikesRepo,
    private readonly postLikesRepo: PostLikesRepo,
  ) {}

  async execute() {
    const devices = await this.devicesRepo.deleteAll();
    const commentLikes = await this.commentLikesRepo.deleteAll();
    const comments = await this.commentsRepo.deleteAll();
    const postLikes = await this.postLikesRepo.deleteAll();
    const posts = await this.postsRepo.deleteAll();
    const blogs = await this.blogsRepo.deleteAll();
    const users = await this.usersRepo.deleteAll();

    return true;
  }
}
