import { IsString, Length, Validate } from 'class-validator';
import { IsTrim } from 'src/infrastructure/validators/is-trim';

export class CreateCommentDto {
  @IsString()
  @Validate(IsTrim)
  @Length(20, 300)
  content: string;
}
