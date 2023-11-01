import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepo } from 'src/posts/posts.repo';

@Injectable()
export class UpdatePostUseCase {
  constructor(private readonly postsRepo: PostsRepo) {}

  async execute(
    blogId: string,
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
  ) {
    const post = await this.postsRepo.findById(postId);
    console.log('20++update-post-UC', post);

    if (!post) throw new NotFoundException();
    if (post.blogId !== blogId) throw new NotFoundException();
    const data = [blogId, postId, title, shortDescription, content];

    return await this.postsRepo.updatePost(data);
  }
}
