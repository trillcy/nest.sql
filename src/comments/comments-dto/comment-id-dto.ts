import { IsUUID, Validate } from 'class-validator';
import { IsTrim } from 'src/infrastructure/validators/is-trim';

export class CommentIdDto {
  @Validate(IsTrim)
  @IsUUID()
  commentId: string;
}
