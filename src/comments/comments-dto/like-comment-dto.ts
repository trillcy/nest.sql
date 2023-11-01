import { IsString, Validate } from 'class-validator';
import { IsStatus } from 'src/infrastructure/validators/is-status';

export class LikeCommentDto {
  @IsString()
  @Validate(IsStatus)
  likeStatus: string = 'None';
}
