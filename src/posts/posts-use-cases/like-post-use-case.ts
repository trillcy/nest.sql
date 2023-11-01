import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepo } from 'src/posts/posts.repo';
import { PostLikesRepo } from 'src/post-likes/post-likes.repo';

@Injectable()
export class LikePostUseCase {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly postLikesRepo: PostLikesRepo,
  ) {}

  async execute(
    userId: string,
    userLogin: string,
    postId: string,
    likeStatus: string,
  ) {
    const post = await this.postsRepo.findById(postId);
    if (!post) throw new NotFoundException();
    const myLike = await this.postLikesRepo.findMyStatus([postId, userId]);

    const newData = [likeStatus, userId, userLogin, postId, new Date()];

    if (!myLike) {
      const newLike = await this.postLikesRepo.createStatus(newData);

      return newLike;
    } else {
      const updatedData = [myLike.id, likeStatus, new Date()];
      return this.postLikesRepo.updateMyStatus(updatedData);
    }
  }
}
