import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepo } from 'src/posts/posts.repo';
import { CommentLikesRepo } from 'src/comment-likes/comment-likes.repo';
import { CommentsRepo } from '../comments.repo';

@Injectable()
export class LikeCommentUseCase {
  constructor(
    private readonly commentsRepo: CommentsRepo,
    private readonly commentLikesRepo: CommentLikesRepo,
  ) {}

  async execute(
    userId: string,
    userLogin: string,
    commentId: string,
    likeStatus: string,
  ) {
    const comment = await this.commentsRepo.findById(commentId);
    if (!comment) throw new NotFoundException();
    const myLike = await this.commentLikesRepo.findMyStatus([
      commentId,
      userId,
    ]);

    if (!myLike) {
      const newData = [likeStatus, userId, userLogin, commentId, new Date()];

      return await this.commentLikesRepo.createStatus(newData);
    } else {
      const myStatus = myLike.status;
      let newStatus: string;
      switch (likeStatus) {
        case 'Like':
          if (myStatus === 'Dislike') {
            const updatedData = [myLike.id, 'None', new Date()];
            return this.commentLikesRepo.updateMyStatus(updatedData);
          }
          // if (myStatus === 'Dislike') {
          //   return await this.commentLikesRepo.deleteMyStatus(myLike.id);
          // }
          break;
        case 'Dislike':
          if (myStatus === 'Like') {
            const updatedData = [myLike.id, 'None', new Date()];
            return this.commentLikesRepo.updateMyStatus(updatedData);
          }
          // if (myStatus === 'Like') {
          //   return await this.commentLikesRepo.deleteMyStatus(myLike.id);
          // }
          break;
        default:
          return;
      }
    }
  }
}
