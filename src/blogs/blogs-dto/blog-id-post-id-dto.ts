import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BlogIdPostIdDto {
  @IsNotEmpty()
  @IsUUID()
  blogId: string;
  @IsNotEmpty()
  @IsUUID()
  postId: string;
}
