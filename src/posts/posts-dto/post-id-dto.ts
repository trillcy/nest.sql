import { IsString, IsUUID } from 'class-validator';

export class PostIdDto {
  @IsUUID()
  postId: string;
}
